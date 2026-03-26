import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { Service } from "../models/Service.model.js";
import { Staff } from "../models/Staff.model.js";
import { Booking } from "../models/Booking.model.js";
import { Block } from "../models/Block.model.js";

/**
 * Helpers: convert "HH:mm" to minutes and back
 */
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Check if date is in the past (yyyy-mm-dd) based on server local time.
 */
function isPastDate(dateStr) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const input = new Date(y, mo - 1, d, 0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input < today;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

/**
 * Return availability for a service on a date.
 * If staffId is provided -> return that staff's slots.
 * If no staffId -> return merged "Any Staff" slots.
 */
export async function getAvailability({ serviceId, date, staffId = null }) {
  if (!serviceId || !date) {
    throw new ApiError(400, "serviceId and date required");
  }

  if (isPastDate(date)) {
    throw new ApiError(400, "Cannot book past dates");
  }

  const service = await Service.findById(serviceId).lean();
  if (!service || !service.isActive) {
    throw new ApiError(404, "Service not available");
  }

  const interval = Number(env.SLOT_INTERVAL_MINUTES || 15);
  const duration = service.duration;

  const staffFilter = staffId
    ? { _id: staffId, isActive: true }
    : { isActive: true };

  const allStaff = await Staff.find(staffFilter).lean();

  // only keep staff who can do this service
  const eligibleStaff = allStaff.filter((st) => {
    if (!st.services?.length) return true;
    return st.services.some((sid) => String(sid) === String(serviceId));
  });

  if (!eligibleStaff.length) {
    return {
      date,
      serviceId,
      serviceName: service.name,
      slotsByStaff: [],
      anyStaffSlots: [],
    };
  }

  const [bookings, blocks] = await Promise.all([
    Booking.find({ date, status: { $in: ["pending", "confirmed"] } }).lean(),
    Block.find({ date }).lean(),
  ]);

  const slotsByStaff = eligibleStaff.map((st) => {
    if (st.leaveDates?.includes(date)) {
      return { staffId: st._id, staffName: st.name, slots: [] };
    }

    const startMin = toMinutes(st.workingHours?.start || "10:00");
    const endMin = toMinutes(st.workingHours?.end || "20:00");

    const candidate = [];
    for (let t = startMin; t + duration <= endMin; t += interval) {
      candidate.push({ start: t, end: t + duration });
    }

    const staffBookings = bookings.filter(
      (b) => String(b.staffId) === String(st._id)
    );

    const staffBlocks = blocks.filter(
      (bl) => bl.staffId === null || String(bl.staffId) === String(st._id)
    );

    const slots = candidate.map((slot) => {
      let isAvailable = true;

      for (const b of staffBookings) {
        const bs = toMinutes(b.startTime);
        const be = toMinutes(b.endTime);
        if (overlaps(slot.start, slot.end, bs, be)) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        for (const bl of staffBlocks) {
          const bls = toMinutes(bl.startTime);
          const ble = toMinutes(bl.endTime);
          if (overlaps(slot.start, slot.end, bls, ble)) {
            isAvailable = false;
            break;
          }
        }
      }

      return {
        time: toHHMM(slot.start),
        available: isAvailable,
      };
    });

    return {
      staffId: st._id,
      staffName: st.name,
      slots,
    };
  });

  // If specific staff selected, frontend can use slotsByStaff[0].slots
  // If no staff selected, also return merged "Any Staff" slots
  let anyStaffSlots = [];

  if (!staffId) {
    const timeMap = new Map();

    for (const staffEntry of slotsByStaff) {
      for (const slot of staffEntry.slots) {
        if (!timeMap.has(slot.time)) {
          timeMap.set(slot.time, {
            time: slot.time,
            available: false,
            availableStaffIds: [],
            availableStaffCount: 0,
          });
        }

        const entry = timeMap.get(slot.time);

        if (slot.available) {
          entry.available = true;
          entry.availableStaffIds.push(staffEntry.staffId);
          entry.availableStaffCount += 1;
        }
      }
    }

    anyStaffSlots = Array.from(timeMap.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }

  return {
    date,
    serviceId,
    serviceName: service.name,
    slotsByStaff,
    anyStaffSlots,
  };
}
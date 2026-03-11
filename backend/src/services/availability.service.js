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
 * For production, keep server TZ = Asia/Kolkata OR convert using a TZ library later.
 */
function isPastDate(dateStr) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const input = new Date(y, mo - 1, d, 0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input < today;
}

/**
 * Return available slots for a service on a date.
 * Optional staffId: if given, return slots for that staff only.
 */
export async function getAvailability({ serviceId, date, staffId = null }) {
  if (!serviceId || !date) throw new ApiError(400, "serviceId and date required");
  if (isPastDate(date)) throw new ApiError(400, "Cannot book past dates");

  const service = await Service.findById(serviceId).lean();
  if (!service || !service.isActive) throw new ApiError(404, "Service not available");

  const interval = Number(env.SLOT_INTERVAL_MINUTES || 15);
  const duration = service.duration; // minutes

  // Get staff list
  const staffFilter = staffId ? { _id: staffId, isActive: true } : { isActive: true };
  const staffList = await Staff.find(staffFilter).lean();

  if (!staffList.length) return { date, serviceId, slotsByStaff: [] };

  // Fetch bookings + blocks for this date
  const [bookings, blocks] = await Promise.all([
    Booking.find({ date, status: { $in: ["pending", "confirmed"] } }).lean(),
    Block.find({ date }).lean(), // includes global blocks where staffId=null
  ]);

  const slotsByStaff = staffList.map((st) => {
    // Staff leave day check
    if (st.leaveDates?.includes(date)) {
      return { staffId: st._id, staffName: st.name, slots: [] };
    }

    // Optional: if staff has services list, enforce that this staff can do selected service
    if (st.services?.length) {
      const canDo = st.services.some((sid) => String(sid) === String(serviceId));
      if (!canDo) return { staffId: st._id, staffName: st.name, slots: [] };
    }

    const startMin = toMinutes(st.workingHours?.start || "10:00");
    const endMin = toMinutes(st.workingHours?.end || "20:00");

    // Generate slots: cursor increments by interval
    const candidate = [];
    for (let t = startMin; t + duration <= endMin; t += interval) {
      candidate.push({ start: t, end: t + duration });
    }

    // Bookings for this staff (if booking has staffId null you may treat separately)
    const staffBookings = bookings.filter((b) => String(b.staffId) === String(st._id));

    // Blocks: global blocks or staff-specific blocks
    const staffBlocks = blocks.filter(
      (bl) => bl.staffId === null || String(bl.staffId) === String(st._id)
    );

    function overlaps(aStart, aEnd, bStart, bEnd) {
      // Overlap if times intersect
      return aStart < bEnd && aEnd > bStart;
    }

    const available = candidate.filter((slot) => {
      // Remove any slot overlapping bookings
      for (const b of staffBookings) {
        const bs = toMinutes(b.startTime);
        const be = toMinutes(b.endTime);
        if (overlaps(slot.start, slot.end, bs, be)) return false;
      }

      // Remove any slot overlapping blocked time
      for (const bl of staffBlocks) {
        const bls = toMinutes(bl.startTime);
        const ble = toMinutes(bl.endTime);
        if (overlaps(slot.start, slot.end, bls, ble)) return false;
      }

      return true;
    });

    return {
      staffId: st._id,
      staffName: st.name,
      slots: available.map((s) => toHHMM(s.start)),
    };
  });

  return { date, serviceId, serviceName: service.name, slotsByStaff };
}
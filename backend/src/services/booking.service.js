import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { Booking } from "../models/Booking.model.js";
import { Service } from "../models/Service.model.js";
import { Staff } from "../models/Staff.model.js";
import { getAvailability } from "./availability.service.js";
import { sendBookingEmails } from "./notifications.service.js";

function isFutureOrToday(dateStr) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const input = new Date(y, mo - 1, d, 0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input >= today;
}

/**
 * Prevent hoarding: count active future bookings by phone.
 * Example rule: max 2 active future bookings per phone number.
 */
async function enforceBookingLimit(phone) {
  const max = Number(env.MAX_ACTIVE_BOOKINGS_PER_PHONE || 2);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const count = await Booking.countDocuments({
    phone,
    date: { $gte: todayStr },
    status: { $in: ["pending", "confirmed"] },
  });

  if (count >= max) {
    throw new ApiError(
      429,
      `Booking limit reached. Max ${max} active bookings per phone.`,
    );
  }
}

/**
 * Create booking
 * Works for:
 * - logged in user booking
 * - guest/public booking (user = null)
 */
export async function createBooking({ user, body }) {
  let { serviceId, staffId, date, startTime, customerName, phone, email } =
    body;

  if (!isFutureOrToday(date)) {
    throw new ApiError(400, "Cannot book past date");
  }

  await enforceBookingLimit(phone);

  const service = await Service.findById(serviceId).lean();
  if (!service || !service.isActive) {
    throw new ApiError(404, "Service not available");
  }

  // If staff selected, validate it
  let selectedStaff = null;

  if (staffId) {
    selectedStaff = await Staff.findOne({
      _id: staffId,
      isActive: true,
    }).lean();
    if (!selectedStaff) {
      throw new ApiError(404, "Staff not available");
    }

    if (selectedStaff.services?.length) {
      const canDo = selectedStaff.services.some(
        (sid) => String(sid) === String(serviceId),
      );
      if (!canDo) {
        throw new ApiError(400, "Selected staff cannot perform this service");
      }
    }
  }

  const availability = await getAvailability({ serviceId, date, staffId });

  // CASE 1: specific staff selected
  if (staffId) {
    const staffSlots = availability.slotsByStaff?.[0]?.slots || [];

    const selectedSlot = staffSlots.find((slot) => slot.time === startTime);

    if (!selectedSlot || !selectedSlot.available) {
      throw new ApiError(
        409,
        "Slot not available anymore. Please choose another slot.",
      );
    }
  } else {
    // CASE 2: no staff selected -> use Any Staff
    const anyStaffSlot = availability.anyStaffSlots?.find(
      (slot) => slot.time === startTime,
    );

    if (!anyStaffSlot || !anyStaffSlot.available) {
      throw new ApiError(
        409,
        "Slot not available anymore. Please choose another slot.",
      );
    }

    const availableStaffIds = anyStaffSlot.availableStaffIds || [];
    if (!availableStaffIds.length) {
      throw new ApiError(
        409,
        "No staff available for this slot anymore. Please choose another slot.",
      );
    }

    // choose least-loaded staff for that date
    const existingBookings = await Booking.find({
      date,
      staffId: { $in: availableStaffIds },
      status: { $in: ["pending", "confirmed"] },
    }).lean();

    const bookingCountMap = new Map();
    for (const sid of availableStaffIds) {
      bookingCountMap.set(String(sid), 0);
    }

    for (const b of existingBookings) {
      const key = String(b.staffId);
      bookingCountMap.set(key, (bookingCountMap.get(key) || 0) + 1);
    }

    let bestStaffId = availableStaffIds[0];
    let minCount = bookingCountMap.get(String(bestStaffId)) || 0;

    for (const sid of availableStaffIds) {
      const count = bookingCountMap.get(String(sid)) || 0;
      if (count < minCount) {
        minCount = count;
        bestStaffId = sid;
      }
    }

    staffId = bestStaffId;
    selectedStaff = await Staff.findById(staffId).lean();

    if (!selectedStaff) {
      throw new ApiError(404, "Assigned staff not found");
    }
  }

  const [h, m] = startTime.split(":").map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + service.duration;
  const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
  const endM = String(endMin % 60).padStart(2, "0");
  const endTime = `${endH}:${endM}`;

  let booking;

  try {
    booking = await Booking.create({
      serviceId,
      staffId,
      date,
      startTime,
      endTime,
      customerName,
      phone,
      email,
      userId: user?.id || null,
      status: "pending",
    });
  } catch (err) {
    if (err?.code === 11000) {
      throw new ApiError(
        409,
        "This slot just got booked. Please choose another slot.",
      );
    }
    throw err;
  }

  try {
    await sendBookingEmails({
      booking,
      serviceName: service.name,
      staffName: selectedStaff?.name,
    });
  } catch (emailErr) {
    console.error("Booking email failed:", emailErr.message);
  }

  return booking.toObject();
}

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
      `Booking limit reached. Max ${max} active bookings per phone.`
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
  const { serviceId, staffId, date, startTime, customerName, phone, email } = body;

  // 1) Do not allow past date booking
  if (!isFutureOrToday(date)) {
    throw new ApiError(400, "Cannot book past date");
  }

  // 2) Enforce booking limit per phone
  await enforceBookingLimit(phone);

  // 3) Validate service
  const service = await Service.findById(serviceId).lean();
  if (!service || !service.isActive) {
    throw new ApiError(404, "Service not available");
  }

  // 4) Validate staff
  const staff = await Staff.findOne({ _id: staffId, isActive: true }).lean();
  if (!staff) {
    throw new ApiError(404, "Staff not available");
  }

  // 5) Check if selected staff can perform selected service
  if (staff.services?.length) {
    const canDo = staff.services.some((sid) => String(sid) === String(serviceId));
    if (!canDo) {
      throw new ApiError(400, "Selected staff cannot perform this service");
    }
  }

  // 6) Re-check dynamic availability right before booking creation
  const availability = await getAvailability({ serviceId, date, staffId });
  const staffSlots = availability.slotsByStaff?.[0]?.slots || [];

  if (!staffSlots.includes(startTime)) {
    throw new ApiError(409, "Slot not available anymore. Please choose another slot.");
  }

  // 7) Compute end time using service duration
  const [h, m] = startTime.split(":").map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + service.duration;
  const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
  const endM = String(endMin % 60).padStart(2, "0");
  const endTime = `${endH}:${endM}`;

  let booking;

  try {
    // 8) Create booking
    booking = await Booking.create({
      serviceId,
      staffId,
      date,
      startTime,
      endTime,
      customerName,
      phone,
      email,
      userId: user?.id || null, // null for public guest booking
      status: "pending",
    });
  } catch (err) {
    // 9) Handle race condition / duplicate slot booking
    if (err?.code === 11000) {
      throw new ApiError(409, "This slot just got booked. Please choose another slot.");
    }
    throw err;
  }

  // 10) Send emails after booking is already safely created
  // If email fails, booking still exists
  try {
    await sendBookingEmails({
      booking,
      serviceName: service.name,
      staffName: staff.name,
    });
  } catch (emailErr) {
    console.error("Booking email failed:", emailErr.message);
    // Do not throw here, booking is already created
  }

  return booking.toObject();
}
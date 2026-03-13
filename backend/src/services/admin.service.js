import { ApiError } from "../utils/ApiError.js";
import { Booking } from "../models/Booking.model.js";
import { Service } from "../models/Service.model.js";
import { Staff } from "../models/Staff.model.js";

export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    noShowBookings,
    activeServices,
    activeStaff,
    todayBookings,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "confirmed" }),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "cancelled" }),
    Booking.countDocuments({ status: "no_show" }),
    Service.countDocuments({ isActive: true }),
    Staff.countDocuments({ isActive: true }),
    Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    }),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    noShowBookings,
    activeServices,
    activeStaff,
    todayBookings,
    recentBookings,
  };
}

export async function listBookings({
  q = "",
  status = "all",
  page = "1",
  limit = "20",
}) {
  const p = Math.max(1, Number(page));
  const l = Math.min(100, Math.max(1, Number(limit)));

  const filter = {};
  if (status !== "all") filter.status = status;

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [{ customerName: regex }, { phone: regex }, { email: regex }];
  }

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate("staffId", "name")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total, page: p, limit: l };
}

export async function updateBookingStatus(id, { status }) {
  const allowed = new Set(["pending", "confirmed", "cancelled", "no_show"]);
  if (!allowed.has(status)) throw new ApiError(400, "Invalid status");

  const updated = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();
  if (!updated) throw new ApiError(404, "Booking not found");
  return updated;
}

export async function listServices() {
  const services = await Service.find().sort({ createdAt: -1 }).lean();
  return services;
}

export async function createService(body) {
  const { name, duration, price } = body;
  if (!name || !duration || price === undefined)
    throw new ApiError(400, "Missing fields");
  return Service.create(body);
}

export const updateService = async (id, payload) => {
  const allowedUpdates = {
    name: payload.name,
    duration: payload.duration,
    price: payload.price,
    category: payload.category,
    description: payload.description,
    isActive: payload.isActive,
  };
  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });
  const updated = await Service.findByIdAndUpdate(id, allowedUpdates, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new ApiError(404, "Service not found");
  return updated;
};

export async function toggleService(id) {
  const s = await Service.findById(id);
  if (!s) throw new ApiError(404, "Service not found");
  s.isActive = !s.isActive;
  await s.save();
  return s.toObject();
}

export async function listStaff() {
  return Staff.find().sort({ createdAt: -1 }).lean();
}

export async function createStaff(body) {
  const { name } = body;
  if (!name) throw new ApiError(400, "Name required");
  return Staff.create(body);
}

export const updateStaff = async (id, payload) => {
  const allowedUpdates = {
    name: payload.name,
    specialty: payload.specialty,
    services: payload.services,
    isActive: payload.isActive,
    workingHours: payload.workingHours,
    leaveDates: payload.leaveDates,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });
  const updated = await Staff.findByIdAndUpdate(id, allowedUpdates, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new ApiError(404, "Staff not found");
  return updated;
};

export async function toggleStaff(id) {
  const s = await Staff.findById(id);
  if (!s) throw new ApiError(404, "Staff not found");
  s.isActive = !s.isActive;
  await s.save();
  return s.toObject();
}

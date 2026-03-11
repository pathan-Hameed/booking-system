import { Service } from "../models/Service.model.js";
import { Staff } from "../models/Staff.model.js";
import { getAvailability } from "./availability.service.js";

/**
 * Return only active services
 */
export async function listPublicServices() {
  return Service.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Return only active staff
 */
export async function listPublicStaff() {
  return Staff.find({ isActive: true })
    .select("name specialty services workingHours")
    .populate("services", "name")
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * Return dynamic slot availability
 */
export async function getPublicAvailability({ serviceId, date, staffId }) {
  return getAvailability({
    serviceId,
    date,
    staffId: staffId || null,
  });
}
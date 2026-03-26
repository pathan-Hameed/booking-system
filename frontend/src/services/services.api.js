import { apiClient } from "./apiClient";

/**
 * Get all active services for public website
 */
export async function getServices() {
  const res = await apiClient.get("/public/services");
  return res.data.data;
}

/**
 * Get all active staff for public website
 */
export async function getStaff() {
  const res = await apiClient.get("/public/staff");
  return res.data.data;
}

/**
 * Get slot availability
 */
export async function getAvailability({ serviceId, date, staffId }) {
  const res = await apiClient.get("/public/availability", {
    params: {
      serviceId,
      date,
      staffId,
    },
  });
  
  return res.data.data;
}
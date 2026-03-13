import { apiClient } from "./apiClient";


/**
 * Public guest booking
 */
export async function createBooking(payload) {
  const res = await apiClient.post("/public/bookings", payload);
  return res.data.data;
}

/**
 * Optional: later for "My Bookings" page
 */
export async function getMyBookings() {
  const res = await apiClient.get("/user/bookings");
  return res.data.data;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let SERVICES = [
  { id: "svc1", name: "Signature Haircut", duration: 45, price: 899, active: true },
  { id: "svc2", name: "Premium Hair Color", duration: 120, price: 3999, active: true },
  { id: "svc3", name: "Glow Facial", duration: 60, price: 1499, active: true },
];

let STAFF = [
  { id: "st1", name: "Rahul", active: true, specialty: "Hair" },
  { id: "st2", name: "Aisha", active: true, specialty: "Skin" },
];

let BOOKINGS = [
  { id: "bk1", customerName: "Naveen", phone: "9876543210", service: "Signature Haircut", date: "2026-03-04", time: "12:15", status: "confirmed" },
  { id: "bk2", customerName: "Sana", phone: "9988776655", service: "Glow Facial", date: "2026-03-05", time: "17:00", status: "pending" },
  { id: "bk3", customerName: "Arjun", phone: "9123456780", service: "Premium Hair Color", date: "2026-03-06", time: "18:45", status: "cancelled" },
];

export async function adminLogin({ email, password }) {
  await wait(600);
  if (email === "admin@salon.com" && password === "Admin@123") {
    return { token: "mock_admin_token", user: { name: "Admin", email, role: "admin" } };
  }
  throw new Error("Invalid credentials");
}

export async function getDashboardStats() {
  await wait(400);
  const total = BOOKINGS.length;
  const confirmed = BOOKINGS.filter((b) => b.status === "confirmed").length;
  const pending = BOOKINGS.filter((b) => b.status === "pending").length;
  return {
    totalBookings: total,
    confirmedBookings: confirmed,
    pendingBookings: pending,
    activeServices: SERVICES.filter((s) => s.active).length,
    activeStaff: STAFF.filter((s) => s.active).length,
  };
}

export async function listBookings({ q = "", status = "all" }) {
  await wait(450);
  let data = [...BOOKINGS];
  if (status !== "all") data = data.filter((b) => b.status === status);
  if (q) {
    const s = q.toLowerCase();
    data = data.filter((b) => b.customerName.toLowerCase().includes(s) || b.phone.includes(s) || b.service.toLowerCase().includes(s));
  }
  return data;
}

export async function updateBookingStatus(id, status) {
  await wait(350);
  BOOKINGS = BOOKINGS.map((b) => (b.id === id ? { ...b, status } : b));
  return BOOKINGS.find((b) => b.id === id);
}

export async function listServices() {
  await wait(350);
  return [...SERVICES];
}

export async function createService(payload) {
  await wait(450);
  const newItem = { id: `svc_${Math.random().toString(16).slice(2)}`, ...payload, active: true };
  SERVICES = [newItem, ...SERVICES];
  return newItem;
}

export async function toggleService(id) {
  await wait(300);
  SERVICES = SERVICES.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
  return SERVICES.find((s) => s.id === id);
}

export async function listStaff() {
  await wait(350);
  return [...STAFF];
}
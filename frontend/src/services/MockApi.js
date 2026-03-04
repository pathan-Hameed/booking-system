// src/services/mockApi.js
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const mockServices = [
  {
    id: "svc_haircut",
    name: "Signature Haircut",
    duration: 45,
    price: 899,
    description: "Precision cut + wash + finish by senior stylist.",
    category: "Hair",
  },
  {
    id: "svc_color",
    name: "Premium Hair Color",
    duration: 120,
    price: 3999,
    description: "Global color with consultation and aftercare tips.",
    category: "Hair",
  },
  {
    id: "svc_facial",
    name: "Glow Facial",
    duration: 60,
    price: 1499,
    description: "Deep cleanse + exfoliation + glow mask.",
    category: "Skin",
  },
  {
    id: "svc_spa",
    name: "Head Spa Therapy",
    duration: 60,
    price: 1799,
    description: "Stress-relief scalp massage + nourishing ritual.",
    category: "Wellness",
  },
];

export default async function getServices() {
  await wait(450);
  return mockServices;
}

// Dummy availability: 15-min slots between 10:00–20:00 excluding random booked slots
export async function getAvailability({ date, serviceId }) {
  await wait(450);

  const all = [];
  for (let h = 10; h < 20; h++) {
    all.push(`${String(h).padStart(2, "0")}:00`);
    all.push(`${String(h).padStart(2, "0")}:15`);
    all.push(`${String(h).padStart(2, "0")}:30`);
    all.push(`${String(h).padStart(2, "0")}:45`);
  }

  // pretend some slots are booked
  const booked = new Set(["12:15", "13:30", "17:00", "18:45"]);
  const slots = all.filter((s) => !booked.has(s));

  return {
    date,
    serviceId,
    slots,
  };
}

export async function createBooking(payload) {
  await wait(650);

  // In real world, backend creates id + sends email
  return {
    bookingId: `bk_${Math.random().toString(16).slice(2)}`,
    ...payload,
    status: "confirmed",
  };
}
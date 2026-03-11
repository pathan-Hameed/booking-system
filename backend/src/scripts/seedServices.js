import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import { Service } from "../models/Service.model.js";

async function seedServices() {
  try {
    await connectDB();

    const services = [
      {
        name: "Signature Haircut",
        duration: 45,
        price: 899,
        description: "Precision haircut with wash and premium styling finish.",
        category: "Hair",
        isActive: true,
      },
      {
        name: "Premium Hair Color",
        duration: 120,
        price: 3999,
        description: "Global or root touch-up color service with expert consultation.",
        category: "Hair",
        isActive: true,
      },
      {
        name: "Glow Facial",
        duration: 60,
        price: 1499,
        description: "Deep cleanse, exfoliation, mask, and glow finish for refreshed skin.",
        category: "Skin",
        isActive: true,
      },
      {
        name: "Keratin Smoothening",
        duration: 180,
        price: 5499,
        description: "Salon-grade smoothening treatment for frizz control and shine.",
        category: "Hair",
        isActive: true,
      },
      {
        name: "Head Spa Therapy",
        duration: 50,
        price: 1299,
        description: "Relaxing scalp massage and nourishing care for hair wellness.",
        category: "Wellness",
        isActive: true,
      },
    ];

    for (const service of services) {
      const exists = await Service.findOne({ name: service.name });

      if (!exists) {
        await Service.create(service);
        console.log(`Created: ${service.name}`);
      } else {
        console.log(`Already exists: ${service.name}`);
      }
    }

    console.log("✅ Services seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed services:", error.message);
    process.exit(1);
  }
}

seedServices();
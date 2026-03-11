import { mailer } from "../config/mail.js";
import { env } from "../config/env.js";

export async function sendBookingEmails({ booking, serviceName, staffName }) {
  // Email to customer
  const customerMail = {
    from: env.MAIL_FROM,
    to: booking.email,
    subject: booking.status === "pending" ? "Booking Requested ✅" : "Booking Confirmed ✅",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>${booking.status === "pending" ? "Booking Requested" : "Booking Confirmed"}</h3>
        <p><b>Service:</b> ${serviceName}</p>
        <p><b>Date:</b> ${booking.date}</p>
        <p><b>Time:</b> ${booking.startTime} - ${booking.endTime}</p>
        <p><b>Staff:</b> ${staffName || "Any available stylist"}</p>
        <p>Thanks,<br/>Snippet Salon</p>
      </div>
    `,
  };

  // Email to salon admin
  const adminMail = {
    from: env.MAIL_FROM,
    to: env.MAIL_ADMIN,
    subject: "New Booking Created",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>New Booking</h3>
        <p><b>Customer:</b> ${booking.customerName}</p>
        <p><b>Phone:</b> ${booking.phone}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Service:</b> ${serviceName}</p>
        <p><b>Date:</b> ${booking.date}</p>
        <p><b>Time:</b> ${booking.startTime} - ${booking.endTime}</p>
        <p><b>Status:</b> ${booking.status}</p>
      </div>
    `,
  };

  // Send in parallel (faster)
  await Promise.all([mailer.sendMail(customerMail), mailer.sendMail(adminMail)]);
}
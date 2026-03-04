// =============================================================
// BOOK PAGE
// =============================================================

// src/pages/Book.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import SlotPicker from "../components/SlotPicker";
import BookingForm from "../components/BookingForm";
import { useServices } from "../hooks/useServices";
import { useAvailability } from "../hooks/useAvailability";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { formatDate } from "../utils/formatDate";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Book() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { services, loading: servicesLoading } = useServices();
  const { slots, loading: slotsLoading, error: slotsError, fetchAvailability } = useAvailability();
  const { loading: creating, error: createError, submitBooking } = useCreateBooking();

  const [serviceId, setServiceId] = useState(state?.preselectServiceId || "");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  useEffect(() => {
    if (serviceId) {
      setTime("");
      fetchAvailability({ date, serviceId });
    }
  }, [date, serviceId]);

  async function onSubmitCustomer(customer) {
    if (!serviceId) return alert("Please select a service");
    if (!time) return alert("Please select a time slot");

    const booking = await submitBooking({
      serviceId,
      serviceName: selectedService?.name,
      date,
      time,
      ...customer,
    });

    navigate("/bookingSuccess", { state: { booking } });
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Book an Appointment</h2>
        <p className="mt-2 text-zinc-300/80">Choose service, date and a slot — confirm in seconds.</p>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">1) Select Service</div>

            <div className="mt-3">
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
                disabled={servicesLoading}
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} • ₹{s.price} • {s.duration}m
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-sm font-semibold">2) Select Date</div>
            <div className="mt-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              />
              <div className="mt-2 text-xs text-zinc-400">{formatDate(date)}</div>
            </div>

            <div className="mt-6 text-sm font-semibold">3) Choose Time Slot</div>
            {slotsError && <p className="mt-2 text-sm text-red-300">{slotsError}</p>}

            <div className="mt-3">
              <SlotPicker slots={slots} selected={time} onSelect={setTime} loading={slotsLoading} />
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              Note: This is dummy availability now. Backend integration later will make it real-time.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">4) Your Details</div>
            {createError && <p className="mt-3 text-sm text-red-300">{createError}</p>}

            <div className="mt-4">
              <BookingForm onSubmit={onSubmitCustomer} loading={creating} />
            </div>

            <div className="mt-5 text-xs text-zinc-500">
              By booking, you agree to our appointment policy and confirmation emails.
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
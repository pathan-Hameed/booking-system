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

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();
  const {
    slotsByStaff,
    loading: slotsLoading,
    error: slotsError,
    fetchAvailability,
  } = useAvailability();

  const {
    loading: bookingLoading,
    error: bookingError,
    submitBooking,
  } = useCreateBooking();

  const [serviceId, setServiceId] = useState(state?.preselectServiceId || "");
  const [date, setDate] = useState(todayISO());
  const [staffId, setStaffId] = useState("");
  const [time, setTime] = useState("");

  const selectedService = useMemo(
    () => services.find((s) => String(s._id || s.id) === String(serviceId)),
    [services, serviceId],
  );

  /**
   * Whenever service/date changes, refetch availability
   */
  useEffect(() => {
    if (!serviceId || !date) return;

    setStaffId("");
    setTime("");

    fetchAvailability({ serviceId, date });
  }, [serviceId, date]);

  /**
   * Find currently selected staff's slots
   */
  const selectedStaffSlots =
    slotsByStaff.find((item) => String(item.staffId) === String(staffId))
      ?.slots || [];

  async function handleBookingSubmit(customerForm) {
    if (!serviceId) {
      alert("Please select a service");
      return;
    }

    if (!staffId) {
      alert("Please select a staff member");
      return;
    }

    if (!time) {
      alert("Please select a time slot");
      return;
    }

    const bookingPayload = {
      serviceId,
      staffId,
      date,
      startTime: time,
      customerName: customerForm.customerName,
      phone: customerForm.phone,
      email: customerForm.email,
    };

    try {
      const booking = await submitBooking(bookingPayload);

      navigate("/bookingSuccess", {
        state: { booking },
      });
    } catch {
      // error already handled in hook state
    }
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Book an Appointment
        </h2>
        <p className="mt-2 text-zinc-300/80">
          Select service, date, staff, and time slot.
        </p>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">1) Select Service</div>

            {servicesError && (
              <p className="mt-3 text-sm text-rose-300">{servicesError}</p>
            )}

            <div className="mt-3">
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                disabled={servicesLoading}
                className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option
                    key={service._id || service.id}
                    value={service._id || service.id}
                  >
                    {service.name} • ₹{service.price} • {service.duration}m
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
              <div className="mt-2 text-xs text-zinc-400">
                {formatDate(date)}
              </div>
            </div>

            <div className="mt-6 text-sm font-semibold">3) Select Staff</div>

            <div className="mt-3">
              <select
                value={staffId}
                onChange={(e) => {
                  setStaffId(e.target.value);
                  setTime("");
                }}
                disabled={!slotsByStaff.length}
                className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              >
                <option value="">Select staff</option>
                {slotsByStaff.map((staff) => (
                  <option key={staff.staffId} value={staff.staffId}>
                    {staff.staffName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-sm font-semibold">
              4) Choose Time Slot
            </div>

            {slotsError && (
              <p className="mt-3 text-sm text-rose-300">{slotsError}</p>
            )}

            <div className="mt-3">
              <SlotPicker
                slots={selectedStaffSlots}
                selected={time}
                onSelect={setTime}
                loading={slotsLoading}
              />
            </div>

            {selectedService ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold">
                  {selectedService.name}
                </div>
                <div className="mt-1 text-sm text-zinc-300/80">
                  ₹{selectedService.price} • {selectedService.duration} mins
                </div>
                {selectedService.description ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    {selectedService.description}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Right panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">5) Your Details</div>

            {bookingError && (
              <p className="mt-3 text-sm text-rose-300">{bookingError}</p>
            )}

            <div className="mt-4">
              <BookingForm
                onSubmit={handleBookingSubmit}
                loading={bookingLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

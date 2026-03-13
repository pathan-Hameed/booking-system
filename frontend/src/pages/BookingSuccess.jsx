import { useLocation, NavLink } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { formatDate } from "../utils/formatDate";

export default function BookingSuccess() {
  const { state } = useLocation();
  const booking = state?.booking;

  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs tracking-[0.2em] text-zinc-300/80">
            BOOKING CREATED
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
            Your booking request is submitted ✅
          </h2>

          {!booking ? (
            <p className="mt-4 text-zinc-300/80">No booking details found.</p>
          ) : (
            <div className="mt-6 space-y-2 text-zinc-200">
              <div className="text-sm text-zinc-400">Booking ID</div>
              <div className="font-semibold">{booking._id}</div>

              <div className="mt-4 text-sm text-zinc-400">Date</div>
              <div className="font-semibold">{formatDate(booking.date)}</div>

              <div className="mt-4 text-sm text-zinc-400">Time</div>
              <div className="font-semibold">
                {booking.startTime} - {booking.endTime}
              </div>

              <div className="mt-4 text-sm text-zinc-400">Status</div>
              <div className="font-semibold capitalize">{booking.status}</div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <NavLink
              to="/"
              className="inline-flex justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-white/90 transition"
            >
              Back to Home
            </NavLink>

            <NavLink
              to="/services"
              className="inline-flex justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Explore Services
            </NavLink>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
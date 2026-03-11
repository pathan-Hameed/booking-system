import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { getDashboardStats } from "../features/dashboard/dashboard.api";

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusTone(status) {
  if (status === "confirmed") return "success";
  if (status === "pending") return "warning";
  if (status === "cancelled") return "danger";
  if (status === "no_show") return "danger";
  return "default";
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="mt-2 text-sm text-zinc-300/80">
              Salon performance, bookings, and team activity at a glance.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-zinc-400">Loading dashboard...</div>
        ) : error ? (
          <div className="mt-6 text-sm text-red-400">{error}</div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total bookings" value={stats?.totalBookings ?? 0} />
              <StatCard label="Today’s bookings" value={stats?.todayBookings ?? 0} />
              <StatCard label="Active services" value={stats?.activeServices ?? 0} />
              <StatCard label="Active staff" value={stats?.activeStaff ?? 0} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Confirmed" value={stats?.confirmedBookings ?? 0} />
              <StatCard label="Pending" value={stats?.pendingBookings ?? 0} />
              <StatCard label="Cancelled" value={stats?.cancelledBookings ?? 0} />
              <StatCard label="No show" value={stats?.noShowBookings ?? 0} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Latest customer appointments in your salon.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {stats?.recentBookings?.length ? (
                    stats.recentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-zinc-950/60 p-4"
                      >
                        <div>
                          <div className="font-medium text-white">
                            {booking.customerName || "Customer"}
                          </div>
                          <div className="mt-1 text-sm text-zinc-400">
                            {booking.phone || booking.email || "-"}
                          </div>
                          <div className="mt-2 text-xs text-zinc-500">
                            Booked on {formatDateTime(booking.createdAt)}
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge tone={getStatusTone(booking.status)}>
                            {booking.status || "-"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">No recent bookings found.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">Operational Snapshot</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Quick health check of bookings and salon activity.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                    <div className="text-sm text-zinc-400">Booking pipeline</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">Pending</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.pendingBookings ?? 0}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">Confirmed</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.confirmedBookings ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                    <div className="text-sm text-zinc-400">Service capacity</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">Active services</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.activeServices ?? 0}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">Active staff</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.activeStaff ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                    <div className="text-sm text-zinc-400">Attention required</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">Cancelled</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.cancelledBookings ?? 0}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <div className="text-xs text-zinc-400">No show</div>
                        <div className="mt-1 text-xl font-semibold">
                          {stats?.noShowBookings ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
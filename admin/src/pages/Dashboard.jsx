import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/mockAdminApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => setStats(await getDashboardStats()))();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="mt-2 text-sm text-zinc-300/80">Today’s overview at a glance.</p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total bookings" value={stats?.totalBookings ?? "—"} />
          <StatCard label="Confirmed" value={stats?.confirmedBookings ?? "—"} />
          <StatCard label="Pending" value={stats?.pendingBookings ?? "—"} />
          <StatCard label="Active services" value={stats?.activeServices ?? "—"} />
          <StatCard label="Active staff" value={stats?.activeStaff ?? "—"} />
        </div>
      </div>
    </PageTransition>
  );
}
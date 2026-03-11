import { useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { useBookings } from "../features/bookings/useBookings";

function getStatusTone(status) {
  if (status === "confirmed") return "success";
  if (status === "pending") return "warning";
  if (status === "cancelled") return "danger";
  if (status === "no_show") return "danger";
  return "default";
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function Bookings() {
  const {
    bookings,
    meta,
    filters,
    loading,
    error,
    fetchBookings,
    changeStatus,
  } = useBookings();

  const [search, setSearch] = useState(filters.q || "");
  const [status, setStatus] = useState(filters.status || "all");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((meta.total || 0) / (meta.limit || 20)));
  }, [meta.total, meta.limit]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchBookings({
      q: search,
      status,
      page: 1,
    });
  };

  const handleFilterStatus = async (nextStatus) => {
    setStatus(nextStatus);
    await fetchBookings({
      q: search,
      status: nextStatus,
      page: 1,
    });
  };

  const handlePageChange = async (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    await fetchBookings({
      q: search,
      status,
      page: nextPage,
    });
  };

  const handleStatusUpdate = async (row, nextStatus) => {
    const id = row._id || row.id;
    setActionLoadingId(id);

    const result = await changeStatus(id, nextStatus);

    setActionLoadingId("");

    if (!result.success) {
      alert(result.message);
    }
  };

  const columns = [
    {
      key: "customerName",
      header: "Customer",
      render: (r) => (
        <div>
          <div className="font-medium text-white">{r.customerName || "-"}</div>
          <div className="text-xs text-zinc-400">{r.phone || r.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "serviceName",
      header: "Service",
      render: (r) => r.serviceName || r.service?.name || "-",
    },
    {
      key: "staffName",
      header: "Staff",
      render: (r) => r.staffName || r.staff?.name || "-",
    },
    {
      key: "slot",
      header: "Appointment",
      render: (r) => (
        <div>
          <div>{r.date || "-"}</div>
          <div className="text-xs text-zinc-400">{r.startTime || r.time || "-"}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={getStatusTone(r.status)}>
          {r.status || "-"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Booked On",
      render: (r) => (
        <span className="text-sm text-zinc-300/80">
          {formatDateTime(r.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => {
        const id = r._id || r.id;
        const busy = actionLoadingId === id;

        return (
          <select
            value={r.status}
            disabled={busy}
            onChange={(e) => handleStatusUpdate(r, e.target.value)}
            className="h-9 rounded-lg bg-zinc-950 border border-white/10 px-3 text-sm outline-none focus:border-white/30"
          >
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
            <option value="no_show">no_show</option>
          </select>
        );
      },
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Bookings</h2>
            <p className="mt-2 text-sm text-zinc-300/80">
              Track appointments, search customers, and update booking status.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <div className="text-xs uppercase tracking-wide text-zinc-400">Total bookings</div>
            <div className="mt-1 text-2xl font-semibold">{meta.total}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[1fr_180px_120px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, or email"
              className="h-11 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            />

            <select
              value={status}
              onChange={(e) => handleFilterStatus(e.target.value)}
              className="h-11 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-white px-5 text-zinc-900 font-semibold hover:bg-white/90 transition"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-2">
          {loading ? (
            <div className="p-6 text-sm text-zinc-400">Loading bookings...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-400">{error}</div>
          ) : (
            <DataTable columns={columns} rows={bookings} />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-sm text-zinc-400">
            Page <span className="text-white">{meta.page}</span> of{" "}
            <span className="text-white">{totalPages}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
              className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages || loading}
              className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
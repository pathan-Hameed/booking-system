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
  if (status === "expired") return "default";
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

function formatAppointment(date, startTime, endTime) {
  if (!date || !startTime) return "-";

  const start = new Date(`${date}T${startTime}:00`);
  const end = endTime ? new Date(`${date}T${endTime}:00`) : null;

  const dateFormatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(start);

  const timeFormatted = new Intl.DateTimeFormat("en-IN", {
    timeStyle: "short",
  }).format(start);

  const endTimeFormatted = end
    ? new Intl.DateTimeFormat("en-IN", {
        timeStyle: "short",
      }).format(end)
    : null;

  return {
    date: dateFormatted,
    time: endTimeFormatted
      ? `${timeFormatted} - ${endTimeFormatted}`
      : timeFormatted,
  };
}

function formatWhatsappNumber(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;

  return digits;
}

function buildWhatsappMessage(booking) {
  const customerName = booking.customerName || "Guest";
  const serviceName = booking.serviceId?.name || "Salon Service";
  const staffName = booking.staffId?.name || "Our Specialist";

  const formattedDate = booking.date
    ? new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const formatTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedStartTime = formatTo12Hour(booking.startTime);
  const formattedEndTime = formatTo12Hour(booking.endTime);

  return `Dear ${customerName},

We are delighted to confirm your appointment with *Snippet Salon*.

*APPOINTMENT DETAILS*

Service
${serviceName}

Stylist
${staffName}

Date
${formattedDate}

Time
${formattedStartTime}${formattedEndTime ? ` - ${formattedEndTime}` : ""}

Kindly arrive 5–10 minutes prior to your scheduled appointment for a seamless experience.

Should you need any assistance, rescheduling, or cancellation, please feel free to get in touch with us in advance.

We look forward to welcoming you and serving you.

Warm regards,
*Snippet Salon*
Luxury Hair • Beauty • Care`;
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

  const openWhatsapp = (booking) => {
    const phone = formatWhatsappNumber(booking.phone);

    if (!phone) {
      alert("Customer phone number is not available");
      return;
    }

    const text = encodeURIComponent(buildWhatsappMessage(booking));
    const url = `https://wa.me/${phone}?text=${text}`;

    window.open(url, "_blank");
  };

  const columns = [
    {
      key: "customerName",
      header: "Customer",
      render: (r) => (
        <div>
          <div className="font-medium text-white">{r.customerName || "-"}</div>
          <div className="text-xs text-zinc-400">
            {r.phone || r.email || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "serviceName",
      header: "Service",
      render: (r) => r.serviceId?.name || "-",
    },
    {
      key: "staffName",
      header: "Staff",
      render: (r) => r.staffId?.name || "-",
    },
    {
      key: "slot",
      header: "Appointment",
      render: (r) => {
        const slot = formatAppointment(r.date, r.startTime, r.endTime);

        return (
          <div>
            <div>{slot.date}</div>
            <div className="text-xs text-zinc-400">{slot.time}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={getStatusTone(r.status)}>{r.status || "-"}</Badge>
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
        const canMessage = r.status === "confirmed";

        return (
          <div className="flex flex-col gap-2 sm:flex-row">
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
              <option value="expired">expired</option>
            </select>

            <button
              type="button"
              disabled={!canMessage}
              onClick={() => openWhatsapp(r)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                canMessage
                  ? "border-white/10 bg-zinc-900 text-white hover:bg-zinc-800"
                  : "cursor-not-allowed border-white/5 bg-zinc-900/40 text-zinc-500 opacity-60"
              }`}
            >
              Message
            </button>
          </div>
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
            <div className="text-xs uppercase tracking-wide text-zinc-400">
              Total bookings
            </div>
            <div className="mt-1 text-2xl font-semibold">{meta.total}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 lg:grid-cols-[1fr_180px_120px]"
          >
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

// ===========================================================================
// File: BookingForm.jsx
// ===========================================================================

// src/components/BookingForm.jsx
import { useState } from "react";

export default function BookingForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    notes: "",
  });

  function setField(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="customerName"
          value={form.customerName}
          onChange={setField}
          placeholder="Full name"
          className="h-11 w-full rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={setField}
          placeholder="Phone"
          className="h-11 w-full rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
          required
        />
      </div>

      <input
        name="email"
        value={form.email}
        onChange={setField}
        placeholder="Email (for confirmation)"
        className="h-11 w-full rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
        required
      />

      <textarea
        name="notes"
        value={form.notes}
        onChange={setField}
        placeholder="Notes (optional)"
        className="min-h-[90px] w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-white/30"
      />

      <button
        disabled={loading}
        className="h-11 w-full rounded-xl bg-white text-zinc-900 font-semibold hover:bg-white/90 transition disabled:opacity-60"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

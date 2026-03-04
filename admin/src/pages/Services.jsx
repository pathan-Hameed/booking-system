import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { createService, listServices, toggleService } from "../services/mockAdminApi";

export default function Services() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: "", duration: 30, price: 500 });
  const [busy, setBusy] = useState(false);

  async function load() {
    setRows(await listServices());
  }

  useEffect(() => { load(); }, []);

  async function addService(e) {
    e.preventDefault();
    setBusy(true);
    await createService({ ...form, duration: Number(form.duration), price: Number(form.price) });
    setForm({ name: "", duration: 30, price: 500 });
    await load();
    setBusy(false);
  }

  const columns = [
    { key: "name", header: "Service" },
    { key: "duration", header: "Duration", render: (r) => `${r.duration} min` },
    { key: "price", header: "Price", render: (r) => `₹${r.price}` },
    {
      key: "active",
      header: "Status",
      render: (r) => <Badge tone={r.active ? "success" : "danger"}>{r.active ? "active" : "inactive"}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <button
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          onClick={async () => {
            await toggleService(r.id);
            load();
          }}
        >
          Toggle
        </button>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl">
        <h2 className="text-2xl font-semibold">Services</h2>
        <p className="mt-2 text-sm text-zinc-300/80">Create and manage service catalog.</p>

        <form onSubmit={addService} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid sm:grid-cols-4 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Service name"
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              required
            />
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              placeholder="Duration"
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              min={10}
              required
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="Price"
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              min={0}
              required
            />
            <button
              disabled={busy}
              className="h-10 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-white/90 transition disabled:opacity-60"
            >
              {busy ? "Adding..." : "Add service"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <DataTable columns={columns} rows={rows} />
        </div>
      </div>
    </PageTransition>
  );
}
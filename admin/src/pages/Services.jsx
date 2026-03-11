import { useState } from "react";
import PageTransition from "../components/PageTransition";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { useServicesAdmin } from "../features/servcies/useServicesAdmin";

const initialForm = {
  name: "",
  duration: 30,
  price: 500,
  description: "",
  category: "General",
};

export default function Services() {
  const {
    services,
    loading,
    error,
    addService,
    editService,
    toggleServiceStatus,
  } = useServicesAdmin();

  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [editBusy, setEditBusy] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  async function handleAddService(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const result = await addService({
      ...form,
      duration: Number(form.duration),
      price: Number(form.price),
    });

    if (result.success) {
      setForm(initialForm);
      setMessage("Service added successfully");
    } else {
      setMessage(result.message);
    }

    setBusy(false);
  }

  function openEdit(service) {
    setEditingId(service._id || service.id);
    setEditMessage("");
    setEditForm({
      name: service.name || "",
      duration: service.duration || 30,
      price: service.price || 0,
      description: service.description || "",
      category: service.category || "General",
      isActive: service.isActive ?? true,
    });
  }

  async function handleEditService(e) {
    e.preventDefault();
    if (!editingId) return;

    setEditBusy(true);
    setEditMessage("");

    const result = await editService(editingId, {
      ...editForm,
      duration: Number(editForm.duration),
      price: Number(editForm.price),
    });

    if (result.success) {
      setEditMessage("Service updated successfully");
      setEditingId(null);
      setEditForm(initialForm);
    } else {
      setEditMessage(result.message);
    }

    setEditBusy(false);
  }

  const columns = [
    { key: "name", header: "Service" },
    { key: "category", header: "Category" },
    { key: "duration", header: "Duration", render: (r) => `${r.duration} min` },
    { key: "price", header: "Price", render: (r) => `₹${r.price}` },
    {
      key: "description",
      header: "Description",
      render: (r) => (
        <span className="text-sm text-zinc-300/80">
          {r.description || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={r.isActive ? "success" : "danger"}>
          {r.isActive ? "active" : "inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
            onClick={() => openEdit(r)}
          >
            Edit
          </button>

          <button
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
            onClick={async () => {
              await toggleServiceStatus(r._id || r.id);
            }}
          >
            Toggle
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl">
        <h2 className="text-2xl font-semibold">Services</h2>
        <p className="mt-2 text-sm text-zinc-300/80">
          Create and manage service catalog.
        </p>

        <form
          onSubmit={handleAddService}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              onChange={(e) =>
                setForm((p) => ({ ...p, duration: e.target.value }))
              }
              placeholder="Duration"
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              min={10}
              required
            />

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="Price"
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              min={0}
              required
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
            >
              <option value="General">General</option>
              <option value="Hair">Hair</option>
              <option value="Skin">Skin</option>
              <option value="Wellness">Wellness</option>
              <option value="Bridal">Bridal</option>
            </select>
          </div>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Service description"
            className="w-full min-h-[100px] rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
          />

          <button
            disabled={busy}
            className="h-10 rounded-xl bg-white px-5 text-zinc-900 font-semibold hover:bg-white/90 transition disabled:opacity-60"
          >
            {busy ? "Adding..." : "Add service"}
          </button>

          {message && <p className="text-sm text-green-400">{message}</p>}
        </form>

        {editingId && (
          <form
            onSubmit={handleEditService}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Service</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditForm(initialForm);
                  setEditMessage("");
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Service name"
                className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
                required
              />

              <input
                type="number"
                value={editForm.duration}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="Duration"
                className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
                min={10}
                required
              />

              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="Price"
                className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
                min={0}
                required
              />

              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, category: e.target.value }))
                }
                className="h-10 rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              >
                <option value="General">General</option>
                <option value="Hair">Hair</option>
                <option value="Skin">Skin</option>
                <option value="Wellness">Wellness</option>
                <option value="Bridal">Bridal</option>
              </select>
            </div>

            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Service description"
              className="w-full min-h-[100px] rounded-xl bg-zinc-950 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
            />

            <button
              disabled={editBusy}
              className="h-10 rounded-xl bg-white px-5 text-zinc-900 font-semibold hover:bg-white/90 transition disabled:opacity-60"
            >
              {editBusy ? "Updating..." : "Update service"}
            </button>

            {editMessage && <p className="text-sm text-green-400">{editMessage}</p>}
          </form>
        )}

        <div className="mt-6">
          {loading ? (
            <p>Loading services...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <DataTable columns={columns} rows={services} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
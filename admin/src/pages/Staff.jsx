import { useState } from "react";
import PageTransition from "../components/PageTransition";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { useStaff } from "../features/staff/useStaff";

const initialForm = {
  name: "",
  specialty: "",
  isActive: true,
  workingHours: {
    start: "10:00",
    end: "20:00",
  },
};

export default function Staff() {
  const { staff, loading, error, addStaff, editStaff, toggleStaffStatus } = useStaff();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "start" || name === "end") {
      setForm((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [name]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "start" || name === "end") {
      setEditForm((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [name]: value,
        },
      }));
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const result = await addStaff(form);

    if (result.success) {
      setMessage("Staff added successfully");
      setForm(initialForm);
    } else {
      setMessage(result.message);
    }

    setSubmitting(false);
  };

  const openEdit = (row) => {
    setEditingId(row._id || row.id);
    setEditMessage("");
    setEditForm({
      name: row.name || "",
      specialty: row.specialty || "",
      isActive: row.isActive ?? true,
      workingHours: {
        start: row.workingHours?.start || "10:00",
        end: row.workingHours?.end || "20:00",
      },
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    setEditSubmitting(true);
    setEditMessage("");

    const result = await editStaff(editingId, editForm);

    if (result.success) {
      setEditMessage("Staff updated successfully");
      setEditingId(null);
      setEditForm(initialForm);
    } else {
      setEditMessage(result.message);
    }

    setEditSubmitting(false);
  };

  const handleToggleStatus = async (row) => {
    await toggleStaffStatus(row._id || row.id, !row.isActive);
  };

  const columns = [
    { key: "name", header: "Staff" },
    { key: "specialty", header: "Specialty" },
    {
      key: "workingHours",
      header: "Hours",
      render: (r) => (
        <span>
          {r.workingHours?.start} - {r.workingHours?.end}
        </span>
      ),
    },
    {
      key: "isActive",
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
            onClick={() => openEdit(r)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
          >
            Edit
          </button>

          <button
            onClick={() => handleToggleStatus(r)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
          >
            {r.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl">
        <h2 className="text-2xl font-semibold">Staff</h2>
        <p className="mt-2 text-sm text-zinc-300/80">
          Manage stylists and availability.
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Add Staff</h3>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Staff name"
              className="rounded-lg bg-zinc-900 px-4 py-2 border border-white/10 focus:border-white/30"
              required
            />

            <input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              placeholder="Specialty"
              className="rounded-lg bg-zinc-900 px-4 py-2 border border-white/10 focus:border-white/30"
            />

            <input
              type="time"
              name="start"
              value={form.workingHours.start}
              onChange={handleChange}
              className="rounded-lg bg-zinc-900 px-4 py-2 border border-white/10 focus:border-white/30"
            />

            <input
              type="time"
              name="end"
              value={form.workingHours.end}
              onChange={handleChange}
              className="rounded-lg bg-zinc-900 text-gray-200 px-4 py-2 border border-white/10 focus:border-white/30"
            />

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-white px-4 py-2 text-black"
            >
              {submitting ? "Adding..." : "Add Staff"}
            </button>
          </form>

          {message && <p className="mt-2 text-sm text-green-400">{message}</p>}
        </div>

        {editingId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Staff</h3>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditForm(initialForm);
                  setEditMessage("");
                }}
                className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="mt-4 grid gap-4 md:grid-cols-2"
            >
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Staff name"
                className="rounded-lg bg-zinc-900 px-4 py-2"
                required
              />

              <input
                name="specialty"
                value={editForm.specialty}
                onChange={handleEditChange}
                placeholder="Specialty"
                className="rounded-lg bg-zinc-900 px-4 py-2"
              />

              <input
                type="time"
                name="start"
                value={editForm.workingHours.start}
                onChange={handleEditChange}
                className="rounded-lg bg-zinc-900 px-4 py-2"
              />

              <input
                type="time"
                name="end"
                value={editForm.workingHours.end}
                onChange={handleEditChange}
                className="rounded-lg bg-zinc-900 px-4 py-2"
              />

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditChange}
                />
                Active
              </label>

              <button
                type="submit"
                disabled={editSubmitting}
                className="rounded-lg bg-white px-4 py-2 text-black"
              >
                {editSubmitting ? "Updating..." : "Update Staff"}
              </button>
            </form>

            {editMessage && (
              <p className="mt-2 text-sm text-green-400">{editMessage}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <p>Loading staff...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <DataTable columns={columns} rows={staff} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
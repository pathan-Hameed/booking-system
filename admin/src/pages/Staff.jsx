import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { listStaff } from "../services/mockAdminApi";

export default function Staff() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => setRows(await listStaff()))();
  }, []);

  const columns = [
    { key: "name", header: "Staff" },
    { key: "specialty", header: "Specialty" },
    {
      key: "active",
      header: "Status",
      render: (r) => <Badge tone={r.active ? "success" : "danger"}>{r.active ? "active" : "inactive"}</Badge>,
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl">
        <h2 className="text-2xl font-semibold">Staff</h2>
        <p className="mt-2 text-sm text-zinc-300/80">Manage stylists and availability.</p>
        <div className="mt-6">
          <DataTable columns={columns} rows={rows} />
        </div>
      </div>
    </PageTransition>
  );
}
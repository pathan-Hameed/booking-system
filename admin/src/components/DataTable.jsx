export default function DataTable({ columns, rows, emptyText = "No data" }) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-4 py-3 font-semibold text-zinc-200/90">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows?.length ? (
              rows.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-white/5 transition">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-zinc-200/90">
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-zinc-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
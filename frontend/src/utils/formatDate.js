// =============================================================
// file: formatDate.js
// description: Utility function to format date strings for display in the frontend
// =============================================================

// src/utils/formatDate.js
export function formatDate(date) {
  // date: yyyy-mm-dd
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

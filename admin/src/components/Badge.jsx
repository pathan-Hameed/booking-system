export default function Badge({ children, tone = "default" }) {
  const cls =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/20"
      : tone === "warning"
      ? "bg-amber-500/15 text-amber-200 border-amber-500/20"
      : tone === "danger"
      ? "bg-rose-500/15 text-rose-200 border-rose-500/20"
      : "bg-white/10 text-zinc-200 border-white/10";

  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${cls}`}>{children}</span>;
} 
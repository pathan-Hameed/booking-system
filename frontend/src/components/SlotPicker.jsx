// ============================================================================
// SlotPicker.jsx
// ============================================================================

// src/components/SlotPicker.jsx
export default function SlotPicker({ slots, selected, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!slots?.length) {
    return <p className="text-sm text-zinc-400">No slots available for this date.</p>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((t) => {
        const active = t === selected;
        return (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className={[
              "h-10 rounded-xl border text-sm transition",
              active
                ? "bg-white text-zinc-900 border-white"
                : "bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

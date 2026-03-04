// ==================================================================
// ServiceCard.jsx
// ==================================================================

// src/components/ServiceCard.jsx
export default function ServiceCard({ service, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(service)}
      className="text-left group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-400">{service.category}</div>
          <h3 className="mt-1 text-lg font-semibold">{service.name}</h3>
          <p className="mt-2 text-sm text-zinc-300/80">{service.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">₹{service.price}</div>
          <div className="text-xs text-zinc-400">{service.duration} min</div>
        </div>
      </div>

      <div className="mt-4 text-sm font-semibold text-white/80 group-hover:text-white transition">
        Select →
      </div>
    </button>
  );
}

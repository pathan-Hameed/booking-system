// =====================================
// SERVICES PAGE 
// =====================================

// src/pages/Services.jsx
import PageTransition from "../components/PageTransition";
import ServiceCard from "../components/ServiceCard";
import { useServices } from "../hooks/useServices";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const { services, loading, error } = useServices();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Services</h2>
        <p className="mt-2 text-zinc-300/80">Choose a service crafted for premium results.</p>

        {error && <p className="mt-6 text-sm text-red-300">{error}</p>}

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              ))
            : services.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onSelect={() => navigate("/book", { state: { preselectServiceId: s.id } })}
                />
              ))}
        </div>
      </section>
    </PageTransition>
  );
}

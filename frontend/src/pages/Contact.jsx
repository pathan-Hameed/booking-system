// =============================================================
// CONTACT PAGE
// =============================================================

// src/pages/Contact.jsx
import PageTransition from "../components/PageTransition";

export default function Contact() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Contact</h2>
        <p className="mt-2 text-zinc-300/80">Reach us for premium appointments and queries.</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { t: "Phone", d: "+91 98765 43210" },
            { t: "Location", d: "Anantapur, Andhra Pradesh" },
            { t: "Timings", d: "10:00 AM – 8:00 PM" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">{x.t}</div>
              <div className="mt-2 font-semibold">{x.d}</div>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

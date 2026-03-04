// =====================================
// HOME PAGE 
// =====================================

// src/pages/Home.jsx
import { NavLink } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <PageTransition> {/* global component for page transition animation, wraps entire page content */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div
          ref={heroRef}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 sm:p-12"
        > {/* added gsap animation to hero section using useRef */}
          <p className="text-xs tracking-[0.2em] text-zinc-300/80">PREMIUM • APPOINTMENTS • STUDIO</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight">
            Luxury grooming, <span className="text-zinc-200/70">crafted</span> for you.
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300/80">
            A premium salon experience with curated services, refined professionals, and smooth online booking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <NavLink 
              to="/book"
              className="inline-flex justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-white/90 transition"
            > {/* takes to booking page  */}
              Book an Appointment
            </NavLink>
            <NavLink
              to="/services"
              className="inline-flex justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            > {/* takes to services page  */}
              Explore Services
            </NavLink>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { t: "Premium stylists", d: "Senior experts, refined finishes." },
            { t: "Clean booking flow", d: "Real-time slots, quick confirmation." },
            { t: "Luxury ambience", d: "Studio-grade experience, every visit." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">{x.t}</div>
              <div className="mt-2 text-sm text-zinc-300/80">{x.d}</div>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

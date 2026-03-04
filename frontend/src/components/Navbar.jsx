// =============================================================
// NAVBAR
// =============================================================

// src/components/Navbar.jsx
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";

const linkClass =
  "text-sm tracking-wide text-zinc-200/80 hover:text-white transition";

export default function Navbar() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  return (
    <header ref={ref} className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10" />
          <div>
            <div className="text-sm font-semibold tracking-wide">SNIPPET SALON</div>
            <div className="text-xs text-zinc-400">Luxury grooming studio</div>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <NavLink className={linkClass} to="/">Home</NavLink>
          <NavLink className={linkClass} to="/services">Services</NavLink>
          <NavLink className={linkClass} to="/book">Book</NavLink>
          <NavLink className={linkClass} to="/contact">Contact</NavLink>
        </nav>

        <NavLink
          to="/book"
          className="inline-flex items-center rounded-xl bg-white text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
        >
          Book Now
        </NavLink>
      </div>
    </header>
  );
}

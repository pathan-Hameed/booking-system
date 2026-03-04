import { NavLink } from "react-router-dom";

const item = (isActive) =>
  [
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
    isActive ? "bg-white text-zinc-900" : "text-zinc-200/80 hover:bg-white/10 hover:text-white",
  ].join(" ");

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r border-white/5 bg-zinc-950/60 backdrop-blur flex-col">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="text-sm font-semibold tracking-wide">SNIPPET SALON</div>
        <div className="text-xs text-zinc-400">Admin Panel</div>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => item(isActive)}>Dashboard</NavLink>
        <NavLink to="/bookings" className={({ isActive }) => item(isActive)}>Bookings</NavLink>
        <NavLink to="/services" className={({ isActive }) => item(isActive)}>Services</NavLink>
        <NavLink to="/staff" className={({ isActive }) => item(isActive)}>Staff</NavLink>
        <NavLink to="/settings" className={({ isActive }) => item(isActive)}>Settings</NavLink>
      </nav>

      <div className="mt-auto p-4 text-xs text-zinc-500">
        v0.1 • Production-ready structure
      </div>
    </aside>
  );
}
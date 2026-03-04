import { useAuth } from "../features/auth/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</div>
          <div className="text-xs text-zinc-400">Manage bookings, services and staff.</div>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
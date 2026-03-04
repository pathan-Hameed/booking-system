import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import PageTransition from "../components/PageTransition";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "admin@salon.com", password: "Admin@123" });
  const nav = useNavigate();
  const loc = useLocation();

  const from = loc.state?.from || "/dashboard";

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    await login(form);
    nav(from, { replace: true });
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="text-xs tracking-[0.2em] text-zinc-300/80">ADMIN ACCESS</div>
          <h1 className="mt-2 text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-zinc-300/80">Use dummy: admin@salon.com / Admin@123</p>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
            />
            <input
              className="h-11 w-full rounded-xl bg-zinc-950 border border-white/10 px-4 text-sm outline-none focus:border-white/30"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              type="password"
              required
            />
            <button
              disabled={loading}
              className="h-11 w-full rounded-xl bg-white text-zinc-900 font-semibold hover:bg-white/90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
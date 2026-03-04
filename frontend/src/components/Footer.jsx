// =============================================
// Footer.jsx
// =============================================

// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-400 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Snippet Salon. All rights reserved.</p>
        <p className="text-zinc-500">Anantapur • Premium Appointments Only</p>
      </div>
    </footer>
  );
}

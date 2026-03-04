import PageTransition from "../components/PageTransition";

export default function Settings() {
  return (
    <PageTransition>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-2 text-sm text-zinc-300/80">
          Business hours, holidays, policies, notifications — next.
        </p>
      </div>
    </PageTransition>
  );
}
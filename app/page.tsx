import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8" role="main">
      <h1 className="text-3xl font-bold">Real-Time Analytics Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Production-ready dashboard with live feed, historical charts, and preferences.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Go to dashboard"
      >
        Open Dashboard
      </Link>
    </main>
  );
}

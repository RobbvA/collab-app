// app/page.jsx (voorbeeld, pas aan op jouw smaak)
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">CalmHub</h1>
        <p className="text-sm text-neutral-400">
          A minimal daily dashboard for your GitHub life.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
        >
          Open my daily dashboard
        </a>
      </div>
    </main>
  );
}

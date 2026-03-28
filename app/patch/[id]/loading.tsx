export default function PatchDetailLoading() {
  return (
    <section className="relative overflow-x-clip bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_88%_18%,rgba(248,61,84,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_88%_18%,rgba(248,61,84,0.2),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] animate-pulse px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-36">
        <header className="rounded-3xl border border-slate-300 bg-white/92 p-6 shadow-sm dark:border-slate-600 dark:bg-slate-900/85 sm:p-7 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-8 w-full max-w-3xl rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-8 w-4/5 max-w-2xl rounded bg-slate-200 dark:bg-slate-700" />
        </header>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/88 sm:p-8 md:p-10">
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-10/12 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <div className="h-9 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </article>

        <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/85"
            >
              <div className="mb-2 h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
          <div className="mb-4 h-6 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </section>
      </div>
    </section>
  );
}

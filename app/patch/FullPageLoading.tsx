export default function FullPageLoading() {
  return (
    <div className="animate-pulse space-y-12 pb-20">
      {/* Header Skeleton */}
      <header className="space-y-6">
        <div className="h-6 w-32 rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
        <div className="h-16 w-full max-w-lg rounded-2xl bg-archive-zinc-200 dark:bg-archive-zinc-800" />
        <div className="h-4 w-96 rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
      </header>

      {/* Stats & Video Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card h-64 p-8 bg-archive-zinc-200/20 dark:bg-archive-zinc-800/20 border border-archive-zinc-200 dark:border-archive-zinc-800" />
        <div className="glass-card h-64 p-8 bg-archive-zinc-200/20 dark:bg-archive-zinc-800/20 border border-archive-zinc-200 dark:border-archive-zinc-800" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-8 border border-archive-zinc-200 dark:border-archive-zinc-800">
            <div className="flex gap-6">
              <div className="w-60 h-32 rounded-xl bg-archive-zinc-200 dark:bg-archive-zinc-800" />
              <div className="flex-1 space-y-4">
                <div className="h-4 w-1/4 rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
                <div className="h-8 w-3/4 rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
                <div className="h-4 w-full rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

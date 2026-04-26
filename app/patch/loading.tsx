export default function PatchListLoading() {
  return (
    <div className="relative mx-auto w-full max-w-[1200px] px-6 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <header>
        <div className="h-16 w-3/4 max-w-lg rounded-2xl bg-archive-zinc-200 dark:bg-archive-zinc-800 mb-6" />
        <div className="h-4 w-2/3 max-w-md rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
      </header>

      {/* Stats & Video Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card h-64 p-8 bg-archive-zinc-100/50 dark:bg-archive-zinc-900/50 border border-archive-zinc-200 dark:border-archive-zinc-800" />
        <div className="glass-card h-64 p-8 bg-archive-zinc-100/50 dark:bg-archive-zinc-900/50 border border-archive-zinc-200 dark:border-archive-zinc-800" />
      </div>

      {/* List Section Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg bg-archive-zinc-200 dark:bg-archive-zinc-800 mb-8" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 sm:p-8 border border-archive-zinc-200 dark:border-archive-zinc-800">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-60 aspect-video rounded-xl bg-archive-zinc-200 dark:bg-archive-zinc-800" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
                  <div className="h-4 w-24 rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
                </div>
                <div className="h-8 w-3/4 rounded-lg bg-archive-zinc-200 dark:bg-archive-zinc-800" />
                <div className="h-4 w-full rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

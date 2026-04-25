export default function PatchListLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="glass-card p-6 sm:p-8 border border-archive-zinc-200 dark:border-archive-zinc-800"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Thumbnail Skeleton */}
            <div className="w-full sm:w-60 aspect-video rounded-xl bg-archive-zinc-200 dark:bg-archive-zinc-800" />
            
            {/* Content Skeleton */}
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
  );
}

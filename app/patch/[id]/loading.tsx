export default function PatchDetailLoading() {
  return (
    <div className="pb-20 animate-pulse">
      <div className="relative mx-auto w-full max-w-[900px] px-6">
        {/* Header Skeleton */}
        <header className="mb-10 text-center">
          <div className="h-4 w-24 mx-auto rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800 mb-6" />
          <div className="h-10 w-3/4 mx-auto rounded-xl bg-archive-zinc-200 dark:bg-archive-zinc-800 mb-6" />
          <div className="h-4 w-48 mx-auto rounded-full bg-archive-zinc-200 dark:bg-archive-zinc-800" />
        </header>

        {/* Content Skeleton */}
        <article className="glass-card p-6 sm:p-12 mb-10 border-archive-zinc-200 dark:border-archive-zinc-800">
          <div className="space-y-4">
            <div className="h-5 w-full rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
            <div className="h-5 w-full rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
            <div className="h-5 w-11/12 rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
            <div className="h-5 w-10/12 rounded bg-archive-zinc-200 dark:bg-archive-zinc-800" />
          </div>
        </article>
      </div>
    </div>
  );
}

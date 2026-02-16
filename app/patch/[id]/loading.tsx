export default function PatchDetailLoading() {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="rounded-3xl bg-white dark:bg-gray-900 p-5 sm:p-6 md:p-7 animate-pulse">
          <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="rounded-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-10 animate-pulse">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 mb-3" />
          <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
          <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </section>
  );
}

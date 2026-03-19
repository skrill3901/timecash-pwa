export const SchedulePageSkeleton = () => {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-7 w-56 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-3 h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          <div className="h-9 w-28 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`schedule-skeleton-${index}`}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="grid gap-2 md:grid-cols-4">
              <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-8 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

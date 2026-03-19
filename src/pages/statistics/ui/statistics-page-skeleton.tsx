export const StatisticsPageSkeleton = () => {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-7 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-2 h-4 w-96 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
          <div className="h-14 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
        </div>
        <div className="mt-4 h-9 w-28 animate-pulse rounded-md bg-muted" aria-hidden="true" />
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`statistics-summary-skeleton-${index}`}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="h-4 w-20 animate-pulse rounded-md bg-muted" aria-hidden="true" />
            <div className="mt-2 h-8 w-24 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          </div>
        ))}
      </div>

      <section className="space-y-2">
        <div className="h-6 w-44 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={`statistics-table-skeleton-${index}`}
                className="h-10 w-full animate-pulse rounded-md bg-muted"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export const StudentsPageSkeleton = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="space-y-2">
          <div className="h-7 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`students-skeleton-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div className="h-6 w-52 animate-pulse rounded-md bg-muted" aria-hidden="true" />
            <div className="flex gap-2">
              <div className="h-8 w-32 animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

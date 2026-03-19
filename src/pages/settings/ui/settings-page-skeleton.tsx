export const SettingsPageSkeleton = () => {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="h-7 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-muted" aria-hidden="true" />

      <div className="mt-4 grid gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={`settings-input-skeleton-${index}`} className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded-md bg-muted" aria-hidden="true" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="mt-4 h-9 w-28 animate-pulse rounded-md bg-muted" aria-hidden="true" />
    </section>
  );
};

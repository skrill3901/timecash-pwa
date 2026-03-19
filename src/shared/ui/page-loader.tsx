interface PageLoaderProps {
  title?: string;
  rows?: number;
}

export const PageLoader = ({ title = 'Загрузка...', rows = 3 }: PageLoaderProps) => {
  const placeholders = Array.from({ length: rows }, (_, index) => `placeholder-${index}`);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-muted" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">{title}</p>
      </div>

      <div className="space-y-3">
        {placeholders.map((key) => (
          <div key={key} className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-2 md:grid-cols-4">
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

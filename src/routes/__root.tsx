import { AppShell } from '@app/app-shell';
import { SyncProvider, ThemeProvider } from '@app/providers';

import { createRootRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => {
  return (
    <ThemeProvider>
      <SyncProvider>
        <AppShell />
        <TanStackRouterDevtools />
      </SyncProvider>
    </ThemeProvider>
  );
};

const RootNotFound = () => {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-xl border border-border bg-card p-5 text-center">
      <h2 className="text-lg font-semibold">Страница не найдена</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Возможно, ссылка устарела. Вернитесь на главную и продолжите работу.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        На главную
      </Link>
    </section>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: RootNotFound,
});

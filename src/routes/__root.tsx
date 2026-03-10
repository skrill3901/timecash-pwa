import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Header } from 'widgets/header';

const RootLayout = () => {
  return (
    <main className="container">
      <Header />
      <hr />
      <section>
        <Outlet />
      </section>
      <TanStackRouterDevtools />
    </main>
  );
};

export const Route = createRootRoute({ component: RootLayout });

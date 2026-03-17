import { Header } from '@/widgets/header';

import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

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

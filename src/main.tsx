import './index.css';

import { StrictMode } from 'react';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import { routeTree } from './routeTree.gen';

registerSW({ immediate: true });

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

import { useEffect, useState } from 'react';

import { AppHeader } from '@widgets/app-header';
import { BottomNavigation } from '@widgets/bottom-navigation';

import { Outlet } from '@tanstack/react-router';

export const AppShell = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOnline);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      {!isOnline ? (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-700 dark:text-amber-400">
          Оффлайн-режим: данные сохраняются локально и синхронизируются позже.
        </div>
      ) : null}
      <main className="mx-auto w-full max-w-4xl px-4 pt-4 pb-24">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

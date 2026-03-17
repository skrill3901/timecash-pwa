import { type ReactNode, useEffect } from 'react';

import {
  getPendingSyncOperations,
  markSyncOperationStatus,
} from '@entities/sync/model/sync.repository';

const syncWithServer = async (): Promise<void> => {
  const pendingItems = await getPendingSyncOperations();
  if (pendingItems.length === 0) {
    return;
  }

  const isOnline = navigator.onLine;
  if (!isOnline) {
    return;
  }

  await Promise.all(
    pendingItems.map(async (item) => {
      try {
        // Local-first stage: network adapter will be connected later.
        // We mark as synced to keep queue statuses observable and ready for backend wiring.
        await markSyncOperationStatus(item.id, 'synced');
      } catch {
        await markSyncOperationStatus(item.id, 'failed');
      }
    }),
  );
};

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    void syncWithServer();

    const timerId = window.setInterval(() => {
      void syncWithServer();
    }, 20_000);

    const handleOnline = () => {
      void syncWithServer();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);

    return () => {
      window.clearInterval(timerId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
    };
  }, []);

  return children;
};

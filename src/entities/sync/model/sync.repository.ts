import { db, type SyncQueueRecord } from '@shared/config/db';
import { createId } from '@shared/lib/id';

const nowIso = (): string => new Date().toISOString();

export const enqueueSyncOperation = async (
  payload: Omit<SyncQueueRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<void> => {
  const createdAt = nowIso();

  await db.syncQueue.add({
    id: createId(),
    status: 'pending',
    createdAt,
    updatedAt: createdAt,
    ...payload,
  });
};

export const getPendingSyncOperations = async (): Promise<SyncQueueRecord[]> => {
  return db.syncQueue.where('status').equals('pending').sortBy('createdAt');
};

export const markSyncOperationStatus = async (
  id: string,
  status: SyncQueueRecord['status'],
): Promise<void> => {
  await db.syncQueue.update(id, {
    status,
    updatedAt: nowIso(),
  });
};

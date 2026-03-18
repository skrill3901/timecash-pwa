import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type SettingsRecord } from '@shared/config/db';

const nowIso = (): string => new Date().toISOString();

const createDefaultSettings = (): SettingsRecord => ({
  id: 'default',
  hourlyRateSingle: 1000,
  hourlyRatePair: 1600,
  themeMode: 'system',
  updatedAt: nowIso(),
});

export const FALLBACK_SETTINGS: SettingsRecord = {
  id: 'default',
  hourlyRateSingle: 1000,
  hourlyRatePair: 1600,
  themeMode: 'system',
  updatedAt: '',
};

export const ensureSettingsInitialized = async (): Promise<void> => {
  const existingSettings = await db.settings.get('default');

  if (existingSettings) {
    return;
  }

  await db.settings.put(createDefaultSettings());
};

export const getSettings = async (): Promise<SettingsRecord> => {
  const settings = await db.settings.get('default');

  return settings ?? FALLBACK_SETTINGS;
};

export const saveSettings = async (
  payload: Pick<SettingsRecord, 'hourlyRateSingle' | 'hourlyRatePair' | 'themeMode'>,
): Promise<SettingsRecord> => {
  const nextSettings: SettingsRecord = {
    id: 'default',
    ...payload,
    updatedAt: nowIso(),
  };

  await db.settings.put(nextSettings);
  await enqueueSyncOperation({
    entity: 'settings',
    entityId: nextSettings.id,
    operation: 'update',
    payload: JSON.stringify(nextSettings),
  });

  return nextSettings;
};

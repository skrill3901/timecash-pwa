import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type SettingsRecord } from '@shared/config/db';

const nowIso = (): string => new Date().toISOString();

const createDefaultSettings = (): SettingsRecord => ({
  id: 'default',
  hourlyRateSingle: 850,
  hourlyRatePair: 1000,
  rentalRateSingle: 100,
  rentalRatePair: 200,
  themeMode: 'system',
  updatedAt: nowIso(),
});

export const FALLBACK_SETTINGS: SettingsRecord = {
  id: 'default',
  hourlyRateSingle: 850,
  hourlyRatePair: 1000,
  rentalRateSingle: 100,
  rentalRatePair: 200,
  themeMode: 'system',
  updatedAt: '',
};

export const ensureSettingsInitialized = async (): Promise<void> => {
  const existingSettings = await db.settings.get('default');

  if (!existingSettings) {
    await db.settings.put(createDefaultSettings());

    return;
  }

  const hasRentalFields =
    Number.isFinite(existingSettings.rentalRateSingle) &&
    Number.isFinite(existingSettings.rentalRatePair);

  if (hasRentalFields) {
    return;
  }

  await db.settings.put({
    ...existingSettings,
    rentalRateSingle: Number.isFinite(existingSettings.rentalRateSingle)
      ? existingSettings.rentalRateSingle
      : 100,
    rentalRatePair: Number.isFinite(existingSettings.rentalRatePair)
      ? existingSettings.rentalRatePair
      : 200,
    updatedAt: nowIso(),
  });
};

export const getSettings = async (): Promise<SettingsRecord> => {
  const settings = await db.settings.get('default');

  return settings ?? FALLBACK_SETTINGS;
};

export const saveSettings = async (
  payload: Pick<
    SettingsRecord,
    'hourlyRateSingle' | 'hourlyRatePair' | 'rentalRateSingle' | 'rentalRatePair' | 'themeMode'
  >,
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

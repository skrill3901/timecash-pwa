import Dexie, { type EntityTable } from 'dexie';

export interface StudentRecord {
  id: string;
  fullName: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  studentAId: string | null;
  studentBId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsRecord {
  id: 'default';
  hourlyRateSingle: number;
  hourlyRatePair: number;
  rentalRateSingle: number;
  rentalRatePair: number;
  themeMode: 'system' | 'light' | 'dark';
  updatedAt: string;
}

export interface SyncQueueRecord {
  id: string;
  entity: 'student' | 'lesson' | 'settings';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  status: 'pending' | 'synced' | 'failed';
  payload: string;
  createdAt: string;
  updatedAt: string;
}

class TimecashDb extends Dexie {
  students!: EntityTable<StudentRecord, 'id'>;
  lessons!: EntityTable<LessonRecord, 'id'>;
  settings!: EntityTable<SettingsRecord, 'id'>;
  syncQueue!: EntityTable<SyncQueueRecord, 'id'>;

  constructor() {
    super('timecash-db');

    this.version(1).stores({
      students: 'id, fullName, isArchived, updatedAt',
      lessons: 'id, date, updatedAt',
      settings: 'id',
      syncQueue: 'id, entity, entityId, status, createdAt',
    });

    this.version(2)
      .stores({
        students: 'id, fullName, isArchived, updatedAt',
        lessons: 'id, date, updatedAt',
        settings: 'id',
        syncQueue: 'id, entity, entityId, status, createdAt',
      })
      .upgrade(async (transaction) => {
        const settingsTable = transaction.table<SettingsRecord, 'id'>('settings');
        const settings = await settingsTable.toCollection().first();

        if (!settings) {
          return;
        }

        await settingsTable.put({
          ...settings,
          hourlyRateSingle: Number.isFinite(settings.hourlyRateSingle)
            ? settings.hourlyRateSingle
            : 850,
          hourlyRatePair: Number.isFinite(settings.hourlyRatePair) ? settings.hourlyRatePair : 1000,
          rentalRateSingle: Number.isFinite(settings.rentalRateSingle)
            ? settings.rentalRateSingle
            : 100,
          rentalRatePair: Number.isFinite(settings.rentalRatePair) ? settings.rentalRatePair : 200,
          updatedAt: settings.updatedAt || new Date().toISOString(),
        });
      });
  }
}

export const db = new TimecashDb();

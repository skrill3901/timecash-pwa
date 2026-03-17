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
  }
}

export const db = new TimecashDb();

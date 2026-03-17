import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type LessonRecord } from '@shared/config/db';
import { addDays } from '@shared/lib/date-time';

import { isLessonRowComplete } from './lesson.utils';

const nowIso = (): string => new Date().toISOString();

const sanitizeRow = (row: Omit<LessonRecord, 'date' | 'createdAt' | 'updatedAt'>) => {
  return {
    ...row,
    startTime: row.startTime.trim(),
    endTime: row.endTime.trim(),
  };
};

export const getLessonsByDate = async (date: string): Promise<LessonRecord[]> => {
  const rows = await db.lessons.where('date').equals(date).sortBy('startTime');
  return rows;
};

const cloneRowsForDate = async (fromDate: string, toDate: string): Promise<LessonRecord[]> => {
  const sourceRows = await getLessonsByDate(fromDate);
  if (sourceRows.length === 0) {
    return [];
  }

  const createdAt = nowIso();
  const clonedRows = sourceRows.map((row) => ({
    ...row,
    id: crypto.randomUUID(),
    date: toDate,
    createdAt,
    updatedAt: createdAt,
  }));

  await db.lessons.bulkAdd(clonedRows);

  await Promise.all(
    clonedRows.map(async (row) =>
      enqueueSyncOperation({
        entity: 'lesson',
        entityId: row.id,
        operation: 'create',
        payload: JSON.stringify(row),
      }),
    ),
  );

  return clonedRows;
};

export const ensureLessonsByDate = async (date: string): Promise<LessonRecord[]> => {
  const existingRows = await getLessonsByDate(date);
  if (existingRows.length > 0) {
    return existingRows;
  }

  const previousWeekDate = addDays(date, -7);
  return cloneRowsForDate(previousWeekDate, date);
};

export interface SaveLessonRowInput {
  id: string;
  startTime: string;
  endTime: string;
  studentAId: string | null;
  studentBId: string | null;
}

export const saveLessonsByDate = async (
  date: string,
  rows: SaveLessonRowInput[],
): Promise<void> => {
  const existingRows = await getLessonsByDate(date);
  const createdAt = nowIso();

  const nextRows = rows
    .map((row) => sanitizeRow(row))
    .filter((row) =>
      isLessonRowComplete({
        startTime: row.startTime,
        endTime: row.endTime,
        studentAId: row.studentAId,
        studentBId: row.studentBId,
      }),
    )
    .map((row) => ({
      ...row,
      date,
      createdAt,
      updatedAt: createdAt,
    }));

  await db.transaction('rw', db.lessons, async () => {
    await db.lessons.where('date').equals(date).delete();
    if (nextRows.length > 0) {
      await db.lessons.bulkPut(nextRows);
    }
  });

  await Promise.all(
    existingRows.map(async (row) =>
      enqueueSyncOperation({
        entity: 'lesson',
        entityId: row.id,
        operation: 'delete',
        payload: JSON.stringify({ date, id: row.id }),
      }),
    ),
  );

  await Promise.all(
    nextRows.map(async (row) =>
      enqueueSyncOperation({
        entity: 'lesson',
        entityId: row.id,
        operation: 'create',
        payload: JSON.stringify(row),
      }),
    ),
  );
};

export const getLessonsByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<LessonRecord[]> => {
  return db.lessons.filter((item) => item.date >= startDate && item.date <= endDate).sortBy('date');
};

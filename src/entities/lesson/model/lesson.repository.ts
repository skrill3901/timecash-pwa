import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type LessonRecord } from '@shared/config/db';
import { addDays } from '@shared/lib/date-time';
import { createId } from '@shared/lib/id';

import { isLessonRowComplete } from './lesson.utils';

const nowIso = (): string => new Date().toISOString();

interface LessonSeedTemplateItem {
  dayOffset: number;
  startTime: string;
  endTime: string;
  studentAName: string | null;
  studentBName: string | null;
}

const FIRST_RUN_WEEK_TEMPLATE: LessonSeedTemplateItem[] = [
  // Monday
  { dayOffset: 0, startTime: '15:00', endTime: '16:00', studentAName: null, studentBName: null },
  {
    dayOffset: 0,
    startTime: '16:00',
    endTime: '17:00',
    studentAName: 'Щулькина',
    studentBName: null,
  },
  {
    dayOffset: 0,
    startTime: '17:00',
    endTime: '18:00',
    studentAName: 'Илья',
    studentBName: 'Катя',
  },
  {
    dayOffset: 0,
    startTime: '18:00',
    endTime: '19:00',
    studentAName: 'Матвей',
    studentBName: 'Лиза',
  },
  {
    dayOffset: 0,
    startTime: '19:00',
    endTime: '20:00',
    studentAName: 'Вова',
    studentBName: 'Вероника',
  },
  {
    dayOffset: 0,
    startTime: '20:00',
    endTime: '21:00',
    studentAName: 'Вышлова',
    studentBName: null,
  },
  // Tuesday
  {
    dayOffset: 1,
    startTime: '16:45',
    endTime: '17:45',
    studentAName: 'Миша',
    studentBName: 'Вера',
  },
  {
    dayOffset: 1,
    startTime: '17:45',
    endTime: '18:45',
    studentAName: 'Кулакова',
    studentBName: 'Ксюша',
  },
  {
    dayOffset: 1,
    startTime: '19:00',
    endTime: '20:00',
    studentAName: 'Калинина',
    studentBName: 'Кузьмин',
  },
  {
    dayOffset: 1,
    startTime: '20:00',
    endTime: '21:00',
    studentAName: 'Дианов',
    studentBName: 'Канищева',
  },
  {
    dayOffset: 1,
    startTime: '21:00',
    endTime: '22:00',
    studentAName: 'Дианов',
    studentBName: 'Канищева',
  },
  // Wednesday
  { dayOffset: 2, startTime: '15:00', endTime: '16:00', studentAName: null, studentBName: null },
  {
    dayOffset: 2,
    startTime: '16:00',
    endTime: '17:00',
    studentAName: 'Щулькина',
    studentBName: null,
  },
  {
    dayOffset: 2,
    startTime: '17:00',
    endTime: '18:00',
    studentAName: 'Тимофей',
    studentBName: 'Ксюша',
  },
  {
    dayOffset: 2,
    startTime: '18:00',
    endTime: '19:00',
    studentAName: 'Вышлова',
    studentBName: null,
  },
  {
    dayOffset: 2,
    startTime: '19:00',
    endTime: '20:00',
    studentAName: 'Пашев',
    studentBName: 'Гордеева',
  },
  {
    dayOffset: 2,
    startTime: '20:00',
    endTime: '21:00',
    studentAName: 'Перепечкина',
    studentBName: null,
  },
  // Thursday
  { dayOffset: 3, startTime: '15:40', endTime: '16:40', studentAName: null, studentBName: null },
  {
    dayOffset: 3,
    startTime: '16:40',
    endTime: '17:40',
    studentAName: 'Миша',
    studentBName: 'Вера',
  },
  {
    dayOffset: 3,
    startTime: '17:40',
    endTime: '18:40',
    studentAName: 'Даша',
    studentBName: 'Вероника',
  },
  {
    dayOffset: 3,
    startTime: '19:00',
    endTime: '20:00',
    studentAName: 'Матвей',
    studentBName: 'Лиза',
  },
  // Friday
  {
    dayOffset: 4,
    startTime: '16:00',
    endTime: '17:00',
    studentAName: 'Романенко',
    studentBName: null,
  },
  {
    dayOffset: 4,
    startTime: '17:00',
    endTime: '18:00',
    studentAName: 'Егорова',
    studentBName: null,
  },
  {
    dayOffset: 4,
    startTime: '18:00',
    endTime: '19:00',
    studentAName: 'Венюков',
    studentBName: 'Самсонова',
  },
  {
    dayOffset: 4,
    startTime: '19:00',
    endTime: '20:00',
    studentAName: 'Вова',
    studentBName: 'Вероника',
  },
  {
    dayOffset: 4,
    startTime: '20:30',
    endTime: '21:30',
    studentAName: 'Калинина',
    studentBName: 'Кузьмин',
  },
  // Saturday
  { dayOffset: 5, startTime: '11:15', endTime: '12:15', studentAName: null, studentBName: null },
  {
    dayOffset: 5,
    startTime: '12:30',
    endTime: '14:00',
    studentAName: 'группа ср+мл',
    studentBName: null,
  },
  { dayOffset: 5, startTime: '14:00', endTime: '15:00', studentAName: null, studentBName: null },
  {
    dayOffset: 5,
    startTime: '15:00',
    endTime: '16:00',
    studentAName: 'Егорова',
    studentBName: null,
  },
  {
    dayOffset: 5,
    startTime: '16:00',
    endTime: '17:30',
    studentAName: 'группа старшие',
    studentBName: null,
  },
  {
    dayOffset: 5,
    startTime: '17:45',
    endTime: '19:00',
    studentAName: 'обучение тренеров',
    studentBName: null,
  },
];

const sanitizeRow = (row: Omit<LessonRecord, 'date' | 'createdAt' | 'updatedAt'>) => {
  return {
    ...row,
    startTime: row.startTime.trim(),
    endTime: row.endTime.trim(),
  };
};

const getWeekMonday = (date: string): string => {
  const currentDate = new Date(`${date}T00:00:00`);
  const day = currentDate.getDay();
  const diffToMonday = (day + 6) % 7;

  currentDate.setDate(currentDate.getDate() - diffToMonday);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayOfMonth}`;
};

const buildStudentNames = (): string[] => {
  const names = new Set<string>();

  FIRST_RUN_WEEK_TEMPLATE.forEach((item) => {
    if (item.studentAName) {
      names.add(item.studentAName.trim());
    }

    if (item.studentBName) {
      names.add(item.studentBName.trim());
    }
  });

  return [...names];
};

const ensureFirstRunSeed = async (date: string): Promise<void> => {
  const lessonsCount = await db.lessons.count();

  if (lessonsCount > 0) {
    return;
  }

  const existingStudents = await db.students.toArray();
  const studentByName = new Map(
    existingStudents.map((student) => [student.fullName.trim(), student.id]),
  );
  const createdAt = nowIso();
  const addedStudents = buildStudentNames()
    .filter((name) => !studentByName.has(name))
    .map((fullName) => {
      const id = createId();

      studentByName.set(fullName, id);

      return {
        id,
        fullName,
        isArchived: false,
        createdAt,
        updatedAt: createdAt,
      };
    });

  const mondayDate = getWeekMonday(date);
  const lessonRows = FIRST_RUN_WEEK_TEMPLATE.map((item) => {
    const studentAId = item.studentAName ? (studentByName.get(item.studentAName) ?? null) : null;
    const studentBId = item.studentBName ? (studentByName.get(item.studentBName) ?? null) : null;

    return {
      id: createId(),
      date: addDays(mondayDate, item.dayOffset),
      startTime: item.startTime,
      endTime: item.endTime,
      studentAId,
      studentBId,
      createdAt,
      updatedAt: createdAt,
    };
  });

  await db.transaction('rw', db.students, db.lessons, async () => {
    if (addedStudents.length > 0) {
      await db.students.bulkAdd(addedStudents);
    }

    await db.lessons.bulkAdd(lessonRows);
  });

  await Promise.all(
    addedStudents.map(async (student) =>
      enqueueSyncOperation({
        entity: 'student',
        entityId: student.id,
        operation: 'create',
        payload: JSON.stringify(student),
      }),
    ),
  );

  await Promise.all(
    lessonRows.map(async (row) =>
      enqueueSyncOperation({
        entity: 'lesson',
        entityId: row.id,
        operation: 'create',
        payload: JSON.stringify(row),
      }),
    ),
  );
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
    id: createId(),
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
  await ensureFirstRunSeed(date);

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

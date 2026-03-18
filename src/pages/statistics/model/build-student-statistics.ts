import type { LessonRow } from '@entities/lesson';
import type { Student } from '@entities/student';

import { calculateDurationHours } from '@shared/lib/date-time';

interface PairHoursMap {
  [partnerName: string]: number;
}

export interface StudentStatisticsRow {
  studentId: string;
  studentName: string;
  singleHours: number;
  pairHours: number;
  totalHours: number;
  pairDetails: PairHoursMap;
}

const resolveStudentName = (
  studentsById: Map<string, Student>,
  studentId: string | null,
): string | null => {
  if (!studentId) {
    return null;
  }

  const student = studentsById.get(studentId);

  if (!student || typeof student.fullName !== 'string' || student.fullName.trim().length === 0) {
    return 'Неизвестный ученик';
  }

  return student.fullName;
};

export const buildStudentStatistics = (
  rows: LessonRow[],
  students: Student[],
): StudentStatisticsRow[] => {
  const studentsById = new Map(students.map((student) => [student.id, student]));
  const statsByStudentId = new Map<string, StudentStatisticsRow>();

  const getOrCreate = (studentId: string, studentName: string): StudentStatisticsRow => {
    const existing = statsByStudentId.get(studentId);

    if (existing) {
      return existing;
    }

    const nextRow: StudentStatisticsRow = {
      studentId,
      studentName,
      singleHours: 0,
      pairHours: 0,
      totalHours: 0,
      pairDetails: {},
    };

    statsByStudentId.set(studentId, nextRow);

    return nextRow;
  };

  for (const row of rows) {
    const duration = calculateDurationHours(row.startTime, row.endTime);

    if (duration === null) {
      continue;
    }

    const studentAName = resolveStudentName(studentsById, row.studentAId);
    const studentBName = resolveStudentName(studentsById, row.studentBId);

    if (!row.studentAId && !row.studentBId) {
      continue;
    }

    if (row.studentAId && !row.studentBId && studentAName) {
      const stat = getOrCreate(row.studentAId, studentAName);

      stat.singleHours += duration;
      stat.totalHours += duration;
      continue;
    }

    if (!row.studentAId && row.studentBId && studentBName) {
      const stat = getOrCreate(row.studentBId, studentBName);

      stat.singleHours += duration;
      stat.totalHours += duration;
      continue;
    }

    if (row.studentAId && row.studentBId && studentAName && studentBName) {
      const first = getOrCreate(row.studentAId, studentAName);
      const second = getOrCreate(row.studentBId, studentBName);

      first.pairHours += duration;
      first.totalHours += duration;
      first.pairDetails[studentBName] = (first.pairDetails[studentBName] ?? 0) + duration;

      second.pairHours += duration;
      second.totalHours += duration;
      second.pairDetails[studentAName] = (second.pairDetails[studentAName] ?? 0) + duration;
    }
  }

  return [...statsByStudentId.values()].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, 'ru-RU'),
  );
};

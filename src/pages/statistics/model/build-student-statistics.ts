import type { LessonRow } from '@entities/lesson';
import type { Student } from '@entities/student';

import { calculateDurationHours } from '@shared/lib/date-time';

export interface PairDetailStat {
  hours: number;
  amount: number;
}

interface PairHoursMap {
  [partnerName: string]: PairDetailStat;
}

export interface StudentStatisticsRow {
  studentId: string;
  studentName: string;
  singleHours: number;
  pairHours: number;
  totalHours: number;
  singleAmount: number;
  pairAmount: number;
  totalAmount: number;
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
  hourlyRateSingle: number,
  hourlyRatePair: number,
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
      singleAmount: 0,
      pairAmount: 0,
      totalAmount: 0,
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
      const lessonAmount = duration * hourlyRateSingle;

      stat.singleHours += duration;
      stat.totalHours += duration;
      stat.singleAmount += lessonAmount;
      stat.totalAmount += lessonAmount;

      continue;
    }

    if (!row.studentAId && row.studentBId && studentBName) {
      const stat = getOrCreate(row.studentBId, studentBName);
      const lessonAmount = duration * hourlyRateSingle;

      stat.singleHours += duration;
      stat.totalHours += duration;
      stat.singleAmount += lessonAmount;
      stat.totalAmount += lessonAmount;
      continue;
    }

    if (row.studentAId && row.studentBId && studentAName && studentBName) {
      const first = getOrCreate(row.studentAId, studentAName);
      const second = getOrCreate(row.studentBId, studentBName);
      const studentPairAmount = (duration * hourlyRatePair) / 2;

      first.pairHours += duration;
      first.totalHours += duration;
      first.pairAmount += studentPairAmount;
      first.totalAmount += studentPairAmount;
      const firstPair = first.pairDetails[studentBName] ?? { hours: 0, amount: 0 };

      first.pairDetails[studentBName] = {
        hours: firstPair.hours + duration,
        amount: firstPair.amount + studentPairAmount,
      };

      second.pairHours += duration;
      second.totalHours += duration;
      second.pairAmount += studentPairAmount;
      second.totalAmount += studentPairAmount;
      const secondPair = second.pairDetails[studentAName] ?? { hours: 0, amount: 0 };

      second.pairDetails[studentAName] = {
        hours: secondPair.hours + duration,
        amount: secondPair.amount + studentPairAmount,
      };
    }
  }

  return [...statsByStudentId.values()].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, 'ru-RU'),
  );
};

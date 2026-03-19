import { calculateDurationHours } from '@shared/lib/date-time';

import type { LessonRow } from './lesson.types';

export const isFreePair = (studentAId: string | null, studentBId: string | null): boolean => {
  return !studentAId && !studentBId;
};

export const isLessonRowComplete = (row: {
  startTime: string;
  endTime: string;
  studentAId: string | null;
  studentBId: string | null;
}): boolean => {
  if (!row.startTime || !row.endTime) {
    return false;
  }

  const duration = calculateDurationHours(row.startTime, row.endTime);

  if (duration === null) {
    return false;
  }

  if (row.studentAId && row.studentAId === row.studentBId) {
    return false;
  }

  return !isFreePair(row.studentAId, row.studentBId);
};

export interface StatisticsInput {
  rows: LessonRow[];
  hourlyRateSingle: number;
  hourlyRatePair: number;
  rentalRateSingle: number;
  rentalRatePair: number;
}

export interface StatisticsResult {
  totalLessons: number;
  totalHours: number;
  totalAmount: number;
  totalRent: number;
  totalProfit: number;
}

export const calculateStatistics = ({
  rows,
  hourlyRateSingle,
  hourlyRatePair,
  rentalRateSingle,
  rentalRatePair,
}: StatisticsInput): StatisticsResult => {
  return rows.reduce<StatisticsResult>(
    (accumulator, row) => {
      const duration = calculateDurationHours(row.startTime, row.endTime);

      if (duration === null) {
        return accumulator;
      }

      const hasStudentA = Boolean(row.studentAId);
      const hasStudentB = Boolean(row.studentBId);

      if (!hasStudentA && !hasStudentB) {
        return accumulator;
      }

      const isPair = hasStudentA && hasStudentB;
      const hourlyRate = isPair ? hourlyRatePair : hourlyRateSingle;
      const rentalRate = isPair ? rentalRatePair : rentalRateSingle;
      const lessonAmount = duration * hourlyRate;
      const lessonRent = duration * rentalRate;

      return {
        totalLessons: accumulator.totalLessons + 1,
        totalHours: accumulator.totalHours + duration,
        totalAmount: accumulator.totalAmount + lessonAmount,
        totalRent: accumulator.totalRent + lessonRent,
        totalProfit: accumulator.totalProfit + (lessonAmount - lessonRent),
      };
    },
    { totalLessons: 0, totalHours: 0, totalAmount: 0, totalRent: 0, totalProfit: 0 },
  );
};

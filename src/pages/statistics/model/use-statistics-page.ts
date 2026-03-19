import { useMemo, useState } from 'react';

import { calculateStatistics, getLessonsByDateRange, type LessonRow } from '@entities/lesson';
import { useSettings } from '@entities/settings';
import { useAllStudents } from '@entities/student';

import { formatDateInputValue, formatRuDate } from '@shared/lib/date-time';

import { buildStudentStatistics } from './build-student-statistics';

const currentDate = new Date();
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const STATISTICS_SESSION_KEY = 'statistics-page-session';

interface StatisticsSessionSnapshot {
  startDate: string;
  endDate: string;
  rows: LessonRow[];
}

const defaultDateRange = {
  startDate: formatDateInputValue(monthStart),
  endDate: formatDateInputValue(currentDate),
};

const readSessionSnapshot = (): StatisticsSessionSnapshot | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(STATISTICS_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StatisticsSessionSnapshot>;

    if (
      typeof parsed.startDate !== 'string' ||
      typeof parsed.endDate !== 'string' ||
      !Array.isArray(parsed.rows)
    ) {
      return null;
    }

    return {
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      rows: parsed.rows,
    };
  } catch {
    return null;
  }
};

const saveSessionSnapshot = (snapshot: StatisticsSessionSnapshot): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(STATISTICS_SESSION_KEY, JSON.stringify(snapshot));
};

export const useStatisticsPage = () => {
  const initialSession = readSessionSnapshot();
  const settings = useSettings();
  const allStudentsQuery = useAllStudents();
  const allStudents = useMemo(() => allStudentsQuery ?? [], [allStudentsQuery]);
  const [startDate, setStartDate] = useState(
    initialSession?.startDate ?? defaultDateRange.startDate,
  );
  const [endDate, setEndDate] = useState(initialSession?.endDate ?? defaultDateRange.endDate);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<LessonRow[]>(initialSession?.rows ?? []);

  const isRangeValid = useMemo(() => startDate <= endDate, [endDate, startDate]);

  const summary = useMemo(() => {
    if (!settings) {
      return { totalLessons: 0, totalHours: 0, totalAmount: 0, totalRent: 0, totalProfit: 0 };
    }

    return calculateStatistics({
      rows,
      hourlyRateSingle: settings.hourlyRateSingle,
      hourlyRatePair: settings.hourlyRatePair,
      rentalRateSingle: settings.rentalRateSingle,
      rentalRatePair: settings.rentalRatePair,
    });
  }, [rows, settings]);

  const studentsStats = useMemo(
    () =>
      buildStudentStatistics(
        rows,
        allStudents,
        settings?.hourlyRateSingle ?? 0,
        settings?.hourlyRatePair ?? 0,
      ),
    [allStudents, rows, settings?.hourlyRatePair, settings?.hourlyRateSingle],
  );

  const handleShow = async () => {
    if (!isRangeValid || !settings) {
      return;
    }

    setIsLoading(true);
    const lessonRows = await getLessonsByDateRange(startDate, endDate);

    setRows(lessonRows);
    saveSessionSnapshot({
      startDate,
      endDate,
      rows: lessonRows,
    });
    setIsLoading(false);
  };

  return {
    endDate,
    formattedRangeLabel: `${formatRuDate(startDate)} - ${formatRuDate(endDate)}`,
    handleShow,
    isLoading,
    isRangeValid,
    rows,
    setEndDate,
    setStartDate,
    settings,
    startDate,
    studentsStats,
    summary,
  };
};

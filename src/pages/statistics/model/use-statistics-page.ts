import { useMemo, useState } from 'react';

import { calculateStatistics, getLessonsByDateRange, type LessonRow } from '@entities/lesson';
import { useSettings } from '@entities/settings';
import { useAllStudents } from '@entities/student';

import { formatDateInputValue, formatRuDate } from '@shared/lib/date-time';

import { buildStudentStatistics } from './build-student-statistics';

const currentDate = new Date();
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const useStatisticsPage = () => {
  const settings = useSettings();
  const allStudentsQuery = useAllStudents();
  const allStudents = useMemo(() => allStudentsQuery ?? [], [allStudentsQuery]);
  const [startDate, setStartDate] = useState(formatDateInputValue(monthStart));
  const [endDate, setEndDate] = useState(formatDateInputValue(currentDate));
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<LessonRow[]>([]);

  const isRangeValid = useMemo(() => startDate <= endDate, [endDate, startDate]);

  const summary = useMemo(() => {
    if (!settings) {
      return { totalLessons: 0, totalHours: 0, totalAmount: 0 };
    }

    return calculateStatistics({
      rows,
      hourlyRateSingle: settings.hourlyRateSingle,
      hourlyRatePair: settings.hourlyRatePair,
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

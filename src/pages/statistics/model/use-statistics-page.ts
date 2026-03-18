import { useMemo, useState } from 'react';

import { calculateStatistics, getLessonsByDateRange, type LessonRow } from '@entities/lesson';
import { useSettings } from '@entities/settings';
import { useAllStudents } from '@entities/student';

import {
  formatDateInputValue,
  formatRuDate,
  normalizeRuDateInput,
  parseRuDateInput,
} from '@shared/lib/date-time';

import { buildStudentStatistics } from './build-student-statistics';

const currentDate = new Date();
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const useStatisticsPage = () => {
  const settings = useSettings();
  const allStudentsQuery = useAllStudents();
  const allStudents = useMemo(() => allStudentsQuery ?? [], [allStudentsQuery]);
  const [startDate, setStartDate] = useState(formatDateInputValue(monthStart));
  const [endDate, setEndDate] = useState(formatDateInputValue(currentDate));
  const [startDateInput, setStartDateInput] = useState(
    formatRuDate(formatDateInputValue(monthStart)),
  );
  const [endDateInput, setEndDateInput] = useState(formatRuDate(formatDateInputValue(currentDate)));
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
    () => buildStudentStatistics(rows, allStudents),
    [allStudents, rows],
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

  const handleStartDateInputChange = (value: string) => {
    const normalized = normalizeRuDateInput(value);

    setStartDateInput(normalized);

    const parsed = parseRuDateInput(normalized);

    if (parsed) {
      setStartDate(parsed);
    }
  };

  const handleEndDateInputChange = (value: string) => {
    const normalized = normalizeRuDateInput(value);

    setEndDateInput(normalized);

    const parsed = parseRuDateInput(normalized);

    if (parsed) {
      setEndDate(parsed);
    }
  };

  const handleStartDateInputBlur = () => {
    const parsed = parseRuDateInput(startDateInput);

    if (!parsed) {
      setStartDateInput(formatRuDate(startDate));

      return;
    }

    setStartDateInput(formatRuDate(parsed));
  };

  const handleEndDateInputBlur = () => {
    const parsed = parseRuDateInput(endDateInput);

    if (!parsed) {
      setEndDateInput(formatRuDate(endDate));

      return;
    }

    setEndDateInput(formatRuDate(parsed));
  };

  return {
    endDate,
    endDateInput,
    formattedRangeLabel: `${formatRuDate(startDate)} - ${formatRuDate(endDate)}`,
    handleEndDateInputBlur,
    handleEndDateInputChange,
    handleShow,
    handleStartDateInputBlur,
    handleStartDateInputChange,
    isLoading,
    isRangeValid,
    rows,
    setEndDate,
    setStartDate,
    settings,
    startDate,
    startDateInput,
    studentsStats,
    summary,
  };
};

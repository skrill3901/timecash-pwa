import { useEffect, useMemo, useState } from 'react';

import { type EditableLessonRow, ensureLessonsByDate, saveLessonsByDate } from '@entities/lesson';

import { formatDateInputValue, parseTimeToMinutes } from '@shared/lib/date-time';
import { createId } from '@shared/lib/id';

const createEmptyRow = (): EditableLessonRow => ({
  id: createId(),
  startTime: '',
  endTime: '',
  studentAId: null,
  studentBId: null,
});

const normalizeRows = (rows: EditableLessonRow[]): EditableLessonRow[] => {
  if (rows.length === 0) {
    return [createEmptyRow()];
  }

  return rows;
};

export const useSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(formatDateInputValue(new Date()));
  const [rows, setRows] = useState<EditableLessonRow[]>([createEmptyRow()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedRows, setLastSavedRows] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadRows = async () => {
      setIsLoading(true);
      const ensured = await ensureLessonsByDate(selectedDate);

      if (!isMounted) {
        return;
      }

      const editable = ensured.map((item) => ({
        id: item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        studentAId: item.studentAId,
        studentBId: item.studentBId,
      }));

      const nextRows = normalizeRows(editable);

      setRows(nextRows);
      setLastSavedRows(JSON.stringify(nextRows));
      setSaveStatus('');
      setIsLoading(false);
    };

    void loadRows();

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const updateRow = (id: string, payload: Partial<EditableLessonRow>) => {
    const nextRows = rows.map((row) => (row.id === id ? { ...row, ...payload } : row));

    setRows(nextRows);
    setSaveStatus('');
  };

  const handleTimeBlur = (id: string, key: 'startTime' | 'endTime', value: string) => {
    const nextValue = parseTimeToMinutes(value) === null ? '' : value;

    updateRow(id, { [key]: nextValue });
  };

  const handleAddRow = () => {
    setRows((previous) => [...previous, createEmptyRow()]);
    setSaveStatus('');
  };

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(rows) !== lastSavedRows,
    [lastSavedRows, rows],
  );

  const handleSave = async () => {
    setIsSaving(true);
    await saveLessonsByDate(selectedDate, rows);
    setLastSavedRows(JSON.stringify(rows));
    setSaveStatus('Сохранено');

    setIsSaving(false);
  };

  return {
    handleAddRow,
    handleSave,
    handleTimeBlur,
    hasUnsavedChanges,
    isLoading,
    isSaving,
    rows,
    saveStatus,
    selectedDate,
    setSelectedDate,
    updateRow,
  };
};

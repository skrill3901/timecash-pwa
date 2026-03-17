import { useEffect, useState } from 'react';

import {
  type EditableLessonRow,
  ensureLessonsByDate,
  isLessonRowComplete,
  saveLessonsByDate,
} from '@entities/lesson';
import { useStudents } from '@entities/student';

import { formatDateInputValue } from '@shared/lib/date-time';
import { calculateDurationHours } from '@shared/lib/date-time';
import { Button } from '@shared/ui';

const FREE_OPTION = 'free';

const createEmptyRow = (): EditableLessonRow => ({
  id: crypto.randomUUID(),
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

const mapSelectValue = (value: string): string | null => {
  return value === FREE_OPTION ? null : value;
};

export const SchedulePage = () => {
  const students = useStudents() ?? [];
  const [selectedDate, setSelectedDate] = useState(formatDateInputValue(new Date()));
  const [rows, setRows] = useState<EditableLessonRow[]>([createEmptyRow()]);
  const [isLoading, setIsLoading] = useState(false);

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

      setRows(normalizeRows(editable));
      setIsLoading(false);
    };

    void loadRows();

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const persistRows = async (nextRows: EditableLessonRow[]) => {
    await saveLessonsByDate(selectedDate, nextRows);
  };

  const updateRow = async (id: string, payload: Partial<EditableLessonRow>) => {
    const nextRows = rows.map((row) => (row.id === id ? { ...row, ...payload } : row));
    setRows(nextRows);
    await persistRows(nextRows);
  };

  const handleAddRow = async () => {
    const nextRows = [...rows, createEmptyRow()];
    setRows(nextRows);
    await persistRows(nextRows);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Расписание занятий</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Можно редактировать любой день, включая прошедшие даты.
        </p>
        <label className="mt-3 block text-sm">
          День
          <input
            type="date"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Загружаем расписание...
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => {
            const duration = calculateDurationHours(row.startTime, row.endTime);
            const canAddNext = isLessonRowComplete(row);
            const hasSameStudent = Boolean(row.studentAId && row.studentAId === row.studentBId);
            const hasTimeError =
              row.startTime.length > 0 && row.endTime.length > 0 && duration === null;

            return (
              <li key={row.id} className="rounded-xl border border-border bg-card p-3">
                <div className="grid gap-2 md:grid-cols-4">
                  <label className="text-sm">
                    Начало
                    <input
                      type="time"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={row.startTime}
                      onChange={(event) =>
                        void updateRow(row.id, { startTime: event.target.value })
                      }
                    />
                  </label>
                  <label className="text-sm">
                    Окончание
                    <input
                      type="time"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={row.endTime}
                      onChange={(event) => void updateRow(row.id, { endTime: event.target.value })}
                    />
                  </label>
                  <label className="text-sm">
                    Ученик 1
                    <select
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={row.studentAId ?? FREE_OPTION}
                      onChange={(event) =>
                        void updateRow(row.id, {
                          studentAId: mapSelectValue(event.target.value),
                        })
                      }
                    >
                      <option value={FREE_OPTION}>Свободно</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    Ученик 2
                    <select
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={row.studentBId ?? FREE_OPTION}
                      onChange={(event) =>
                        void updateRow(row.id, {
                          studentBId: mapSelectValue(event.target.value),
                        })
                      }
                    >
                      <option value={FREE_OPTION}>Свободно</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {hasTimeError || hasSameStudent ? (
                  <p className="mt-2 text-xs text-destructive">
                    {hasSameStudent
                      ? 'Нельзя выбрать одного и того же ученика в оба поля.'
                      : 'Время окончания должно быть позже времени начала.'}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Строка #{index + 1}</span>
                  {canAddNext ? (
                    <Button type="button" size="sm" onClick={() => void handleAddRow()}>
                      Добавить строку
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

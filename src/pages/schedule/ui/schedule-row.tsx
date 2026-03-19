import { type EditableLessonRow, isLessonRowComplete } from '@entities/lesson';
import type { Student } from '@entities/student';

import { calculateDurationHours, formatTimeInputValue } from '@shared/lib/date-time';
import { Button } from '@shared/ui';

interface ScheduleRowProps {
  index: number;
  row: EditableLessonRow;
  students: Student[];
  onAddRow: () => void;
  onTimeBlur: (id: string, key: 'startTime' | 'endTime', value: string) => void;
  onUpdateRow: (id: string, payload: Partial<EditableLessonRow>) => void;
}

const FREE_OPTION = 'free';

const mapSelectValue = (value: string): string | null => {
  return value === FREE_OPTION ? null : value;
};

export const ScheduleRow = ({
  index,
  row,
  students,
  onAddRow,
  onTimeBlur,
  onUpdateRow,
}: ScheduleRowProps) => {
  const duration = calculateDurationHours(row.startTime, row.endTime);
  const canAddNext = isLessonRowComplete(row);
  const hasSameStudent = Boolean(row.studentAId && row.studentAId === row.studentBId);
  const hasTimeError = row.startTime.length > 0 && row.endTime.length > 0 && duration === null;

  return (
    <li className="rounded-xl border border-border bg-card p-3">
      <div className="grid gap-2 md:grid-cols-4">
        <label className="text-sm">
          Начало
          <input
            type="text"
            lang="ru-RU"
            inputMode="numeric"
            placeholder="00:00"
            maxLength={5}
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={row.startTime}
            onChange={(event) => {
              onUpdateRow(row.id, {
                startTime: formatTimeInputValue(event.target.value),
              });
            }}
            onBlur={(event) => {
              onTimeBlur(row.id, 'startTime', event.target.value);
            }}
          />
        </label>
        <label className="text-sm">
          Окончание
          <input
            type="text"
            lang="ru-RU"
            inputMode="numeric"
            placeholder="00:00"
            maxLength={5}
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={row.endTime}
            onChange={(event) => {
              onUpdateRow(row.id, {
                endTime: formatTimeInputValue(event.target.value),
              });
            }}
            onBlur={(event) => {
              onTimeBlur(row.id, 'endTime', event.target.value);
            }}
          />
        </label>
        <label className="text-sm">
          Ученик 1
          <select
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={row.studentAId ?? FREE_OPTION}
            onChange={(event) => {
              onUpdateRow(row.id, {
                studentAId: mapSelectValue(event.target.value),
              });
            }}
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
            onChange={(event) => {
              onUpdateRow(row.id, {
                studentBId: mapSelectValue(event.target.value),
              });
            }}
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
          <Button type="button" size="sm" onClick={onAddRow}>
            Добавить строку
          </Button>
        ) : null}
      </div>
    </li>
  );
};

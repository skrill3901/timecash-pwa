import { useStudents } from '@entities/student';

import { formatRuDate } from '@shared/lib/date-time';
import { Button } from '@shared/ui';

import { useSchedulePage } from '../model/use-schedule-page';
import { ScheduleRow } from './schedule-row';

export const SchedulePage = () => {
  const students = useStudents() ?? [];
  const {
    dateInput,
    handleDateInputBlur,
    handleDateInputChange,
    handleAddRow,
    handleSave,
    handleTimeBlur,
    hasUnsavedChanges,
    isLoading,
    isSaving,
    rows,
    saveStatus,
    selectedDate,
    updateRow,
  } = useSchedulePage();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Расписание занятий</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Можно редактировать любой день, включая прошедшие даты.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Текущая дата: {formatRuDate(selectedDate)}
        </p>
        <label className="mt-3 block text-sm">
          День
          <input
            type="text"
            lang="ru-RU"
            inputMode="numeric"
            placeholder="дд.мм.гггг"
            maxLength={10}
            pattern="^\d{2}\.\d{2}\.\d{4}$"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={dateInput}
            onChange={(event) => handleDateInputChange(event.target.value)}
            onBlur={handleDateInputBlur}
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {saveStatus ||
              (hasUnsavedChanges ? 'Есть несохранённые изменения' : 'Все изменения сохранены')}
          </p>
          <Button
            type="button"
            size="sm"
            disabled={isLoading || isSaving || !hasUnsavedChanges}
            onClick={() => void handleSave()}
          >
            {isSaving ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Загружаем расписание...
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => (
            <ScheduleRow
              key={row.id}
              index={index}
              row={row}
              students={students}
              onAddRow={handleAddRow}
              onTimeBlur={handleTimeBlur}
              onUpdateRow={updateRow}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

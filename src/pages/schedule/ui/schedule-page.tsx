import { useStudents } from '@entities/student';

import { formatRuDate } from '@shared/lib/date-time';
import { Button, DatePickerInput } from '@shared/ui';

import { useSchedulePage } from '../model/use-schedule-page';
import { SchedulePageSkeleton } from './schedule-page-skeleton';
import { ScheduleRow } from './schedule-row';

export const SchedulePage = () => {
  const studentsQuery = useStudents();
  const students = studentsQuery ?? [];
  const {
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
  } = useSchedulePage();

  if (isLoading || studentsQuery === undefined) {
    return <SchedulePageSkeleton />;
  }

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
        <DatePickerInput label="День" value={selectedDate} onChange={setSelectedDate} />
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
    </section>
  );
};

import { Button, DatePickerInput } from '@shared/ui';

import { useStatisticsPage } from '../model/use-statistics-page';
import { StatisticsSummaryCards } from './statistics-summary-cards';
import { StudentsHoursTable } from './students-hours-table';

export const StatisticsPage = () => {
  const {
    endDate,
    formattedRangeLabel,
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
  } = useStatisticsPage();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Статистика</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Выберите период и нажмите «Показать», чтобы рассчитать часы и доход.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Период: {formattedRangeLabel}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DatePickerInput label="Дата начала" value={startDate} onChange={setStartDate} />
          <DatePickerInput label="Дата конца" value={endDate} onChange={setEndDate} />
        </div>

        {!isRangeValid ? (
          <p className="mt-2 text-xs text-destructive">
            Дата начала не может быть позже даты конца.
          </p>
        ) : null}

        <div className="mt-4">
          <Button
            type="button"
            disabled={!isRangeValid || isLoading || !settings}
            onClick={() => void handleShow()}
          >
            {isLoading ? 'Считаем...' : 'Показать'}
          </Button>
        </div>
      </div>

      <StatisticsSummaryCards
        totalLessons={summary.totalLessons}
        totalHours={summary.totalHours}
        totalAmount={summary.totalAmount}
      />

      <section className="space-y-2">
        <h3 className="text-base font-semibold">Часы по ученикам</h3>
        {rows.length > 0 ? (
          <StudentsHoursTable rows={studentsStats} />
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Нажмите «Показать», чтобы загрузить данные за период.
          </div>
        )}
      </section>
    </section>
  );
};

import { useMemo, useState } from 'react';

import { calculateStatistics, getLessonsByDateRange } from '@entities/lesson';
import { useSettings } from '@entities/settings';

import { formatDateInputValue } from '@shared/lib/date-time';
import { Button } from '@shared/ui';

const currentDate = new Date();
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const StatisticsPage = () => {
  const settings = useSettings();
  const [startDate, setStartDate] = useState(formatDateInputValue(monthStart));
  const [endDate, setEndDate] = useState(formatDateInputValue(currentDate));
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalLessons: 0, totalHours: 0, totalAmount: 0 });

  const isRangeValid = useMemo(() => startDate <= endDate, [endDate, startDate]);

  const handleShow = async () => {
    if (!isRangeValid || !settings) {
      return;
    }

    setIsLoading(true);
    const rows = await getLessonsByDateRange(startDate, endDate);
    const nextStats = calculateStatistics({
      rows,
      hourlyRateSingle: settings.hourlyRateSingle,
      hourlyRatePair: settings.hourlyRatePair,
    });
    setStats(nextStats);
    setIsLoading(false);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Статистика</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Выберите период и нажмите «Показать», чтобы рассчитать часы и доход.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Дата начала
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="text-sm">
            Дата конца
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
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

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Занятий</p>
          <p className="mt-1 text-2xl font-semibold">{stats.totalLessons}</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Часы</p>
          <p className="mt-1 text-2xl font-semibold">{stats.totalHours.toFixed(2)}</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Доход</p>
          <p className="mt-1 text-2xl font-semibold">
            {Math.round(stats.totalAmount).toLocaleString('ru-RU')} ₽
          </p>
        </article>
      </div>
    </section>
  );
};

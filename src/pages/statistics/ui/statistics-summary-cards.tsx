const ruNumberFormatter = new Intl.NumberFormat('ru-RU');
const ruHoursFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const ruCurrencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

interface StatisticsSummaryCardsProps {
  totalLessons: number;
  totalHours: number;
  totalAmount: number;
  totalRent: number;
  totalProfit: number;
}

export const StatisticsSummaryCards = ({
  totalLessons,
  totalHours,
  totalAmount,
  totalRent,
  totalProfit,
}: StatisticsSummaryCardsProps) => {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <article className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Занятий</p>
        <p className="mt-1 text-2xl font-semibold">{ruNumberFormatter.format(totalLessons)}</p>
      </article>
      <article className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Часы</p>
        <p className="mt-1 text-2xl font-semibold">{ruHoursFormatter.format(totalHours)}</p>
      </article>
      <article className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Доход</p>
        <p className="mt-1 text-2xl font-semibold">{ruCurrencyFormatter.format(totalAmount)}</p>
      </article>
      <article className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Аренда</p>
        <p className="mt-1 text-2xl font-semibold">{ruCurrencyFormatter.format(totalRent)}</p>
      </article>
      <article className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Прибыль</p>
        <p className="mt-1 text-2xl font-semibold">{ruCurrencyFormatter.format(totalProfit)}</p>
      </article>
    </div>
  );
};

import { formatRuDuration } from '@shared/lib/date-time';

import type { StudentStatisticsRow } from '../model/build-student-statistics';

const ruCurrencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

interface StudentsHoursTableProps {
  rows: StudentStatisticsRow[];
}

export const StudentsHoursTable = ({ rows }: StudentsHoursTableProps) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        За выбранный период нет данных по ученикам.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[1080px] text-sm">
        <thead className="bg-muted/40 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Ученик</th>
            <th className="px-3 py-2 font-medium">Часы (индив.)</th>
            <th className="px-3 py-2 font-medium">Доход (индив.)</th>
            <th className="px-3 py-2 font-medium">Часы (пары)</th>
            <th className="px-3 py-2 font-medium">Доход (пары)</th>
            <th className="px-3 py-2 font-medium">Итого часов</th>
            <th className="px-3 py-2 font-medium">Итого доход</th>
            <th className="px-3 py-2 font-medium">Пары: с кем, часы и доход</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pairs = Object.entries(row.pairDetails).map(([partnerName, stats]) => {
              return `${partnerName}: ${formatRuDuration(stats.hours)}, ${ruCurrencyFormatter.format(stats.amount)}`;
            });

            return (
              <tr key={row.studentId} className="border-t border-border align-top">
                <td className="px-3 py-2 font-medium">{row.studentName}</td>
                <td className="px-3 py-2">{formatRuDuration(row.singleHours)}</td>
                <td className="px-3 py-2">{ruCurrencyFormatter.format(row.singleAmount)}</td>
                <td className="px-3 py-2">{formatRuDuration(row.pairHours)}</td>
                <td className="px-3 py-2">{ruCurrencyFormatter.format(row.pairAmount)}</td>
                <td className="px-3 py-2">{formatRuDuration(row.totalHours)}</td>
                <td className="px-3 py-2">{ruCurrencyFormatter.format(row.totalAmount)}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {pairs.length > 0 ? pairs.join(' • ') : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

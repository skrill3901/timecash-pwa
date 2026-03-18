import type { StudentStatisticsRow } from '../model/build-student-statistics';

const ruHoursFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
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
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-muted/40 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Ученик</th>
            <th className="px-3 py-2 font-medium">Часы (индив.)</th>
            <th className="px-3 py-2 font-medium">Часы (пары)</th>
            <th className="px-3 py-2 font-medium">Итого часов</th>
            <th className="px-3 py-2 font-medium">Пары: с кем и сколько</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pairs = Object.entries(row.pairDetails).map(([partnerName, hours]) => {
              return `${partnerName}: ${ruHoursFormatter.format(hours)} ч`;
            });

            return (
              <tr key={row.studentId} className="border-t border-border align-top">
                <td className="px-3 py-2 font-medium">{row.studentName}</td>
                <td className="px-3 py-2">{ruHoursFormatter.format(row.singleHours)}</td>
                <td className="px-3 py-2">{ruHoursFormatter.format(row.pairHours)}</td>
                <td className="px-3 py-2">{ruHoursFormatter.format(row.totalHours)}</td>
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

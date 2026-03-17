import { StatisticsPage } from '@pages/statistics';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
});

import { SchedulePage } from '@pages/schedule';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/schedule')({
  component: SchedulePage,
});

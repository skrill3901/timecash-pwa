import { StudentsPage } from '@pages/students';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/students')({
  component: StudentsPage,
});

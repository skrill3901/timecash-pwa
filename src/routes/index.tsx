import { Form } from '@/widgets/form';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <Form />;
}

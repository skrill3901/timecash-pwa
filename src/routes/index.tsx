import { createFileRoute } from '@tanstack/react-router';

import { Form } from 'widgets/form';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <Form />;
}

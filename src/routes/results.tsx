import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/results')({
  component: Results,
});

function Results() {
  return <div>Hello "/results"!</div>;
}

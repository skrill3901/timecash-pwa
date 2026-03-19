import { Button } from '@shared/ui';

import { Link } from '@tanstack/react-router';

export const WelcomePage = () => {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Добро пожаловать в TimeCash</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Приложение помогает вести расписание занятий, считать часы и доход даже без интернета.
      </p>
      <div className="mt-5 flex gap-2">
        <Button asChild>
          <Link to="/schedule">Открыть расписание</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/students">Ученики</Link>
        </Button>
      </div>
    </section>
  );
};

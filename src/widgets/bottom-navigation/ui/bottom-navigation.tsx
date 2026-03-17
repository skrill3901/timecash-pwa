import { APP_NAV_ITEMS } from '@shared/config/navigation';

import { cn } from '@/lib/utils';

import { Link } from '@tanstack/react-router';

export const BottomNavigation = () => {
  return (
    <nav
      aria-label="Главная навигация"
      className="fixed right-0 bottom-0 left-0 z-20 border-t border-border bg-background/95 px-2 py-2 backdrop-blur"
    >
      <ul className="mx-auto grid w-full max-w-4xl grid-cols-5 gap-1">
        {APP_NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={cn(
                'flex min-h-12 items-center justify-center rounded-md px-1 text-center text-xs text-muted-foreground transition-colors',
                'hover:bg-muted hover:text-foreground',
              )}
              activeProps={{
                className:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

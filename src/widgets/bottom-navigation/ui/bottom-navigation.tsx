import { APP_NAV_ITEMS } from '@shared/config/navigation';

import { cn } from '@/lib/utils';

import { Link } from '@tanstack/react-router';
import { BarChart3, CalendarDays, House, type LucideIcon, Settings, Users } from 'lucide-react';

const iconByType: Record<(typeof APP_NAV_ITEMS)[number]['icon'], LucideIcon> = {
  home: House,
  schedule: CalendarDays,
  students: Users,
  statistics: BarChart3,
  settings: Settings,
};

export const BottomNavigation = () => {
  return (
    <nav
      aria-label="Главная навигация"
      className="fixed right-0 bottom-0 left-0 z-20 border-t border-border bg-background/95 px-2 py-2 backdrop-blur"
    >
      <ul className="mx-auto grid w-full max-w-4xl grid-cols-5 gap-1">
        {APP_NAV_ITEMS.map((item) => {
          const Icon = iconByType[item.icon];

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'flex min-h-12 items-center justify-center rounded-md px-1 text-center text-xs text-muted-foreground transition-colors',
                  'hover:bg-muted hover:text-foreground',
                )}
                aria-label={item.label}
                title={item.label}
                activeProps={{
                  className:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                }}
              >
                <Icon className="size-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

import { useTheme } from '@app/providers';

import type { ThemeMode } from '@entities/settings';

import { APP_NAV_ITEMS } from '@shared/config/navigation';
import { Button } from '@shared/ui';

import { useRouterState } from '@tanstack/react-router';

const titlesByPath = APP_NAV_ITEMS.reduce<Record<string, string>>((accumulator, item) => {
  accumulator[item.to] = item.label;
  return accumulator;
}, {});

const THEME_LABELS: Record<ThemeMode, string> = {
  system: 'Система',
  light: 'Светлая',
  dark: 'Тёмная',
};

const getNextTheme = (value: ThemeMode): ThemeMode => {
  if (value === 'system') {
    return 'light';
  }

  if (value === 'light') {
    return 'dark';
  }

  return 'system';
};

export const AppHeader = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { themeMode, setThemeMode } = useTheme();
  const title = titlesByPath[pathname] ?? 'TimeCash';

  const handleThemeClick = async () => {
    await setThemeMode(getNextTheme(themeMode));
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">PWA TimeCash</p>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Переключить тему"
          onClick={() => void handleThemeClick()}
        >
          Тема: {THEME_LABELS[themeMode]}
        </Button>
      </div>
    </header>
  );
};

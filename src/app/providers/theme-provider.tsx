import { createContext, type ReactNode, useContext, useEffect, useMemo } from 'react';

import type { ThemeMode } from '@entities/settings';
import { ensureSettingsInitialized, saveSettings, useSettings } from '@entities/settings';

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyTheme = (themeMode: ThemeMode) => {
  const rootElement = document.documentElement;
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolvedTheme = themeMode === 'system' ? (isSystemDark ? 'dark' : 'light') : themeMode;

  rootElement.classList.toggle('dark', resolvedTheme === 'dark');
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const settings = useSettings();
  const themeMode = settings?.themeMode ?? 'system';

  useEffect(() => {
    void ensureSettingsInitialized();
  }, []);

  useEffect(() => {
    applyTheme(themeMode);

    if (themeMode !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyTheme('system');

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [themeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      setThemeMode: async (nextThemeMode) => {
        const currentSettings = settings ?? {
          hourlyRateSingle: 850,
          hourlyRatePair: 1000,
          rentalRateSingle: 100,
          rentalRatePair: 200,
          themeMode: 'system' as ThemeMode,
        };

        await saveSettings({
          hourlyRateSingle: currentSettings.hourlyRateSingle,
          hourlyRatePair: currentSettings.hourlyRatePair,
          rentalRateSingle: currentSettings.rentalRateSingle,
          rentalRatePair: currentSettings.rentalRatePair,
          themeMode: nextThemeMode,
        });
      },
    }),
    [settings, themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

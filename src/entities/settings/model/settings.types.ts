export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
  id: 'default';
  hourlyRateSingle: number;
  hourlyRatePair: number;
  themeMode: ThemeMode;
  updatedAt: string;
}

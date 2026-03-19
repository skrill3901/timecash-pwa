export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
  id: 'default';
  hourlyRateSingle: number;
  hourlyRatePair: number;
  rentalRateSingle: number;
  rentalRatePair: number;
  themeMode: ThemeMode;
  updatedAt: string;
}

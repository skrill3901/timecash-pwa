import { useEffect, useState } from 'react';

import { useTheme } from '@app/providers';

import type { ThemeMode } from '@entities/settings';
import { saveSettings, useSettings } from '@entities/settings';

import { Button } from '@shared/ui';

const normalizeRate = (value: string): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const SettingsPage = () => {
  const settings = useSettings();
  const { themeMode } = useTheme();
  const [singleRate, setSingleRate] = useState('850');
  const [pairRate, setPairRate] = useState('1000');
  const [singleRent, setSingleRent] = useState('100');
  const [pairRent, setPairRent] = useState('200');
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('system');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!settings) {
      return;
    }

    setSingleRate(String(settings.hourlyRateSingle));
    setPairRate(String(settings.hourlyRatePair));
    setSingleRent(String(settings.rentalRateSingle));
    setPairRent(String(settings.rentalRatePair));
    setCurrentTheme(settings.themeMode);
  }, [settings]);

  useEffect(() => {
    setCurrentTheme(themeMode);
  }, [themeMode]);

  const handleSave = async () => {
    const hourlyRateSingle = normalizeRate(singleRate);
    const hourlyRatePair = normalizeRate(pairRate);
    const rentalRateSingle = normalizeRate(singleRent);
    const rentalRatePair = normalizeRate(pairRent);

    if (
      hourlyRateSingle <= 0 ||
      hourlyRatePair <= 0 ||
      rentalRateSingle <= 0 ||
      rentalRatePair <= 0
    ) {
      setStatus('Укажите корректные положительные ставки.');

      return;
    }

    await saveSettings({
      hourlyRateSingle,
      hourlyRatePair,
      rentalRateSingle,
      rentalRatePair,
      themeMode: currentTheme,
    });

    setStatus('Параметры сохранены.');
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">Параметры</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ставки применяются в статистике с почасовым расчётом.
      </p>

      <div className="mt-4 grid gap-3">
        <label className="text-sm">
          Цена за час (1 ученик)
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={singleRate}
            onChange={(event) => setSingleRate(event.target.value)}
          />
        </label>

        <label className="text-sm">
          Цена за час (пара)
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={pairRate}
            onChange={(event) => setPairRate(event.target.value)}
          />
        </label>

        <label className="text-sm">
          Аренда за одного
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={singleRent}
            onChange={(event) => setSingleRent(event.target.value)}
          />
        </label>

        <label className="text-sm">
          Аренда за двоих
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={pairRent}
            onChange={(event) => setPairRent(event.target.value)}
          />
        </label>

        <label className="text-sm">
          Тема
          <select
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            value={currentTheme}
            onChange={(event) => setCurrentTheme(event.target.value as ThemeMode)}
          >
            <option value="system">Система</option>
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </label>
      </div>

      {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}

      <div className="mt-4">
        <Button type="button" onClick={() => void handleSave()}>
          Сохранить
        </Button>
      </div>
    </section>
  );
};

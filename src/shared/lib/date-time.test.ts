import { describe, expect, it } from 'bun:test';

import {
  addDays,
  calculateDurationHours,
  formatRuDate,
  normalizeRuDateInput,
  parseRuDateInput,
  parseTimeToMinutes,
} from './date-time';

describe('date-time helpers', () => {
  it('parses HH:mm values', () => {
    expect(parseTimeToMinutes('09:30')).toBe(570);
    expect(parseTimeToMinutes('25:30')).toBeNull();
  });

  it('calculates valid duration in hours', () => {
    expect(calculateDurationHours('10:00', '11:30')).toBe(1.5);
    expect(calculateDurationHours('11:30', '10:00')).toBeNull();
  });

  it('returns previous week day via addDays', () => {
    expect(addDays('2026-03-18', -7)).toBe('2026-03-11');
  });

  it('formats date to dd.mm.yyyy', () => {
    expect(formatRuDate('2026-03-18')).toBe('18.03.2026');
  });

  it('normalizes ru date input', () => {
    expect(normalizeRuDateInput('18032026')).toBe('18.03.2026');
    expect(normalizeRuDateInput('18.0')).toBe('18.0');
  });

  it('parses ru date input to iso', () => {
    expect(parseRuDateInput('18.03.2026')).toBe('2026-03-18');
    expect(parseRuDateInput('31.02.2026')).toBeNull();
  });
});

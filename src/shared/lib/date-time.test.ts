import { describe, expect, it } from 'bun:test';

import { addDays, calculateDurationHours, parseTimeToMinutes } from './date-time';

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
});

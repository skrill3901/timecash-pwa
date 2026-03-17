import { describe, expect, it } from 'bun:test';

import { calculateStatistics, isLessonRowComplete } from './lesson.utils';

describe('lesson utils', () => {
  it('validates a complete lesson row', () => {
    expect(
      isLessonRowComplete({
        startTime: '09:00',
        endTime: '10:00',
        studentAId: 'a',
        studentBId: null,
      }),
    ).toBeTrue();

    expect(
      isLessonRowComplete({
        startTime: '09:00',
        endTime: '08:00',
        studentAId: 'a',
        studentBId: null,
      }),
    ).toBeFalse();
  });

  it('calculates statistics for single and pair lessons', () => {
    const result = calculateStatistics({
      hourlyRateSingle: 1000,
      hourlyRatePair: 1500,
      rows: [
        {
          id: '1',
          date: '2026-03-18',
          startTime: '10:00',
          endTime: '11:00',
          studentAId: 's1',
          studentBId: null,
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        },
        {
          id: '2',
          date: '2026-03-18',
          startTime: '11:30',
          endTime: '13:00',
          studentAId: 's1',
          studentBId: 's2',
          createdAt: '2026-03-18T00:00:00.000Z',
          updatedAt: '2026-03-18T00:00:00.000Z',
        },
      ],
    });

    expect(result.totalLessons).toBe(2);
    expect(result.totalHours).toBe(2.5);
    expect(result.totalAmount).toBe(3250);
  });
});

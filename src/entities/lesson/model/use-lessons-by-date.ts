import { useLiveQuery } from 'dexie-react-hooks';

import { getLessonsByDate } from './lesson.repository';

export const useLessonsByDate = (date: string) => {
  return useLiveQuery(async () => getLessonsByDate(date), [date]);
};

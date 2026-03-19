import { useLiveQuery } from 'dexie-react-hooks';

import { getActiveStudents } from './student.repository';

export const useStudents = () => {
  return useLiveQuery(async () => getActiveStudents(), []);
};

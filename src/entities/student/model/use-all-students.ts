import { useLiveQuery } from 'dexie-react-hooks';

import { getAllStudents } from './student.repository';

export const useAllStudents = () => {
  return useLiveQuery(async () => getAllStudents(), []);
};

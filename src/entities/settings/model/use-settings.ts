import { useLiveQuery } from 'dexie-react-hooks';

import { getSettings } from './settings.repository';

export const useSettings = () => {
  return useLiveQuery(async () => getSettings(), []);
};

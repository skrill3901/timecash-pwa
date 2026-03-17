export interface NavItem {
  to: string;
  label: string;
}

export const APP_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Приветствие' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/students', label: 'Студенты' },
  { to: '/statistics', label: 'Статистика' },
  { to: '/settings', label: 'Параметры' },
];

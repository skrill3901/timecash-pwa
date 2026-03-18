export interface NavItem {
  to: string;
  label: string;
  icon: 'home' | 'schedule' | 'students' | 'statistics' | 'settings';
}

export const APP_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Приветствие', icon: 'home' },
  { to: '/schedule', label: 'Расписание', icon: 'schedule' },
  { to: '/students', label: 'Студенты', icon: 'students' },
  { to: '/statistics', label: 'Статистика', icon: 'statistics' },
  { to: '/settings', label: 'Параметры', icon: 'settings' },
];

import { Link } from '@tanstack/react-router';

export const Header = () => {
  return (
    <header>
      <nav>
        <ul className="tabs">
          <li>
            <Link to="/" activeProps={{ 'aria-current': 'page' }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/results" activeProps={{ 'aria-current': 'page' }}>
              Результаты
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

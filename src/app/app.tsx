import { useState } from 'react';

import { Form } from 'components/form';

import './app.css';

const TABS = {
  GENERAL: 'general',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TABS)[keyof typeof TABS];

export const App = () => {
  const [tab, setTab] = useState<TabValue>(TABS.GENERAL);

  return (
    <main className="container">
      <article>
        <header>
          <nav>
            <ul className="tabs">
              <li>
                <button
                  className={`tabs_btn ${tab === TABS.GENERAL ? '' : 'outline'}`}
                  onClick={() => setTab(TABS.GENERAL)}
                >
                  Главная
                </button>
              </li>
              <li>
                <button
                  className={`tabs_btn ${tab === TABS.RESULTS ? '' : 'outline'}`}
                  onClick={() => setTab(TABS.RESULTS)}
                >
                  Результаты
                </button>
              </li>
            </ul>
          </nav>
        </header>
        {tab === TABS.GENERAL ? <Form /> : <div />}
      </article>
    </main>
  );
};

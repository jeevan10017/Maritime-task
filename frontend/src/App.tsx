import { useState } from 'react';
import { RoutesPage }  from './adapters/ui/pages/RoutesPage';
import { ComparePage } from './adapters/ui/pages/ComparePage';
import { BankingPage } from './adapters/ui/pages/BankingPage';
import { PoolingPage } from './adapters/ui/pages/PoolingPage';
import { Ship }        from 'lucide-react';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: 'routes',  label: 'Routes',  sub: 'Fleet overview'   },
  { id: 'compare', label: 'Compare', sub: 'GHG benchmarking' },
  { id: 'banking', label: 'Banking', sub: 'Article 20'       },
  { id: 'pooling', label: 'Pooling', sub: 'Article 21'       },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Header ────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/80
                         backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center
                        justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center
                            rounded-lg bg-brand-600">
              <Ship className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 leading-none">
                Fuel EU Maritime
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Compliance Dashboard
              </p>
            </div>
          </div>

          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn flex flex-col items-center ${
                  activeTab === tab.id
                    ? 'tab-btn-active'
                    : 'tab-btn-inactive'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] leading-none mt-0.5 ${
                  activeTab === tab.id
                    ? 'text-blue-200'
                    : 'text-slate-600'
                }`}>
                  {tab.sub}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'routes'  && <RoutesPage  />}
        {activeTab === 'compare' && <ComparePage />}
        {activeTab === 'banking' && <BankingPage />}
        {activeTab === 'pooling' && <PoolingPage />}
      </main>
    </div>
  );
}
import { useState } from 'react';
import { RoutesPage } from './adapters/ui/pages/RoutesPage';
import { Ship }        from 'lucide-react';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

const TABS: { id: Tab; label: string }[] = [
  { id: 'routes',  label: 'Routes'  },
  { id: 'compare', label: 'Compare' },
  { id: 'banking', label: 'Banking' },
  { id: 'pooling', label: 'Pooling' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Top nav ─────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/80
                         backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center
                        justify-between">
          <div className="flex items-center gap-3">
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
                className={`tab-btn ${
                  activeTab === tab.id
                    ? 'tab-btn-active'
                    : 'tab-btn-inactive'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'routes'  && <RoutesPage />}
        {activeTab === 'compare' && (
          <div className="card text-center text-slate-500 py-16">
            Compare tab — coming in Phase 8
          </div>
        )}
        {activeTab === 'banking' && (
          <div className="card text-center text-slate-500 py-16">
            Banking tab — coming in Phase 8
          </div>
        )}
        {activeTab === 'pooling' && (
          <div className="card text-center text-slate-500 py-16">
            Pooling tab — coming in Phase 8
          </div>
        )}
      </main>
    </div>
  );
}
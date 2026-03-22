import { useState } from 'react';
import { ComplianceApiService } from '../../infrastructure/api/ComplianceApiService';
import { BankingApiService }    from '../../infrastructure/api/BankingApiService';
import { useBanking }           from '../../../core/application/useBanking';
import { CBCard }               from '../components/banking/CBCard';
import { BankForm }             from '../components/banking/BankForm';
import { ApplyForm }            from '../components/banking/ApplyForm';
import { Spinner }              from '../components/shared/Spinner';
import { ErrorMessage }         from '../components/shared/ErrorMessage';
import { YEARS }                from '../../../shared/constants';

const complianceService = new ComplianceApiService();
const bankingService    = new BankingApiService();

const SHIP_IDS = ['R001', 'R002', 'R003', 'R004', 'R005'];

export function BankingPage() {
  const [shipId, setShipId] = useState('R002');
  const [year,   setYear]   = useState(2024);
  const [loaded, setLoaded] = useState(false);

  const {
    cb, summary, loading, error, success,
    loadShip, bankSurplus, applyBanked,
  } = useBanking(complianceService, bankingService);

  const handleLoad = async () => {
    await loadShip(shipId, year);
    setLoaded(true);
  };

  return (
    <div className="space-y-6">

      {/* ── Ship selector ─────────────────────────────── */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-slate-400
                       uppercase tracking-wide">
          Select Ship & Year
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Ship ID
            </label>
            <select
              value={shipId}
              onChange={(e) => { setShipId(e.target.value); setLoaded(false); }}
              className="input-field"
            >
              {SHIP_IDS.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Year</label>
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); setLoaded(false); }}
              className="input-field"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleLoad}
            disabled={loading}
            className="btn-primary px-4 py-2 text-sm"
          >
            {loading ? <><Spinner size="sm" /> Loading…</> : 'Load Ship'}
          </button>
        </div>
      </div>

      {/* ── Feedback ──────────────────────────────────── */}
      {error   && <ErrorMessage message={error} />}
      {success && (
        <div className="rounded-lg border border-emerald-500/30
                        bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          ✓ {success}
        </div>
      )}

      {/* ── Data panels ───────────────────────────────── */}
      {loaded && cb && summary && (
        <>
          <CBCard cb={cb} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BankForm
              cb={cb}
              summary={summary}
              loading={loading}
              onBank={(amount) => bankSurplus(shipId, year, amount)}
            />
            <ApplyForm
              summary={summary}
              loading={loading}
              onApply={(amount) => applyBanked(shipId, year, amount)}
            />
          </div>

          {/* Bank entry history */}
          {summary.entries.length > 0 && (
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300">
                  Bank Entry History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-800/60">
                    <tr>
                      {['ID', 'Original Amount', 'Remaining', 'Created'].map(
                        (h) => <th key={h} className="th">{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {summary.entries.map((e) => (
                      <tr key={e.id}
                          className="hover:bg-slate-800/40 transition-colors">
                        <td className="td font-mono text-slate-400">
                          #{e.id}
                        </td>
                        <td className="td font-mono">
                          {e.amountGco2eq.toLocaleString()}
                        </td>
                        <td className="td font-mono text-emerald-400">
                          {e.remaining.toLocaleString()}
                        </td>
                        <td className="td text-slate-400">
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loaded && !loading && (
        <div className="card text-center py-16 text-slate-500">
          Select a ship and year above, then click Load Ship.
        </div>
      )}
    </div>
  );
}
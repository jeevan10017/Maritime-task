import { useState } from 'react';
import { BankingApiService } from '../../infrastructure/api/BankingApiService';
import { ComplianceApiService } from '../../infrastructure/api/ComplianceApiService';
import { useBanking } from '../../../core/application/useBanking';
import { CBCard } from '../components/banking/CBCard.tsx';
import { BankForm } from '../components/banking/BankForm';
import { ApplyForm } from '../components/banking/ApplyForm';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { YEARS } from '../../../shared/constants';

const bankingService = new BankingApiService();
const complianceService = new ComplianceApiService();

export function BankingPage() {
  const [shipId, setShipId] = useState('VESSEL001');
  const [year, setYear] = useState<number>(YEARS[0]);
  const [balance, setBalance] = useState<any | null>(null);

  const {
    summary,
    loading: bankingLoading,
    error: bankingError,
    bankingBusy,
    fetchSummary,
    bankSurplus,
    applyBanked,
  } = useBanking(bankingService);

  const handleLoadSummary = async () => {
    await fetchSummary(shipId, year);
  };

  return (
    <div className="space-y-6">
      {/* ── Input controls ────────────────────────────────── */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Ship ID</label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="input-field w-full"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleLoadSummary}
              className="btn-primary w-full justify-center"
            >
              Load Summary
            </button>
          </div>
        </div>
      </div>

      {/* ── Errors ────────────────────────────────────────── */}
      {bankingError && <ErrorMessage message={bankingError} />}

      {/* ── CB Card ───────────────────────────────────────── */}
      {summary && (
        <CBCard balance={null} loading={bankingLoading} />
      )}

      {/* ── Forms ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary && (
          <>
            <BankForm
              onSubmit={(input) => bankSurplus(input)}
              loading={bankingBusy}
              shipId={shipId}
              year={year}
              maxAmount={Math.max(0, summary.totalBanked)}
            />
            <ApplyForm
              onSubmit={(input) => applyBanked(input)}
              loading={bankingBusy}
              shipId={shipId}
              year={year}
              available={summary.totalRemaining}
            />
          </>
        )}
      </div>

      {/* ── Summary table ─────────────────────────────────── */}
      {summary && summary.entries.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300">Banking History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/60">
                <tr>
                  {['ID', 'Amount', 'Remaining', 'Created'].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {summary.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40">
                    <td className="td font-mono">{entry.id}</td>
                    <td className="td">{entry.amountGco2eq.toFixed(4)}</td>
                    <td className="td">{entry.remaining.toFixed(4)}</td>
                    <td className="td text-xs">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

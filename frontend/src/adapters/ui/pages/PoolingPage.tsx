import { useState } from 'react';
import { ComplianceApiService } from '../../infrastructure/api/ComplianceApiService';
import { BankingApiService }    from '../../infrastructure/api/BankingApiService';
import { usePooling }           from '../../../core/application/usePooling';
import { MemberSelector }       from '../components/pooling/MemberSelector';
import { PoolResult }           from '../components/pooling/PoolResult';
import { Spinner }              from '../components/shared/Spinner';
import { ErrorMessage }         from '../components/shared/ErrorMessage';
import { YEARS }                from '../../../shared/constants';

const complianceService = new ComplianceApiService();
const bankingService    = new BankingApiService();

const ALL_SHIPS = ['R001', 'R002', 'R003', 'R004', 'R005'];

export function PoolingPage() {
  const [year,     setYear]     = useState(2024);
  const [selected, setSelected] = useState<string[]>([]);

  const {
    adjustedCBs, result, loading, error, success,
    fetchAdjustedCB, createPool,
  } = usePooling(complianceService, bankingService);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const poolSum = selected.reduce((s, id) => {
    const cb = adjustedCBs[id];
    return cb ? s + cb.adjustedCB : s;
  }, 0);

  const canCreate =
    selected.length >= 2 &&
    selected.every((id) => adjustedCBs[id] !== undefined) &&
    poolSum >= 0 &&
    !loading;

  return (
    <div className="space-y-6">

      {/* ── Year selector ─────────────────────────────── */}
      <div className="card flex items-center gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">
            Pool Year
          </label>
          <select
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setSelected([]);
            }}
            className="input-field"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Click a ship card to add/remove from pool.
          Load CB first to see adjusted balances.
        </p>
      </div>

      {/* ── Feedback ──────────────────────────────────── */}
      {error   && <ErrorMessage message={error} />}
      {success && (
        <div className="rounded-lg border border-emerald-500/30
                        bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          ✓ {success}
        </div>
      )}

      {/* ── Member selector ───────────────────────────── */}
      <MemberSelector
        allShipIds={ALL_SHIPS}
        selected={selected}
        adjustedCBs={adjustedCBs}
        year={year}
        onToggle={toggle}
        onFetchCB={(id) => fetchAdjustedCB(id, year)}
      />

      {/* ── Create pool button ────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {selected.length < 2
            ? 'Select at least 2 ships to create a pool.'
            : `${selected.length} ships selected`}
        </p>
        <button
          onClick={() => createPool(year, selected)}
          disabled={!canCreate}
          className="btn-primary px-5 py-2.5 text-sm"
        >
          {loading
            ? <><Spinner size="sm" /> Creating…</>
            : 'Create Pool'}
        </button>
      </div>

      {/* ── Pool result ───────────────────────────────── */}
      {result && <PoolResult result={result} />}
    </div>
  );
}
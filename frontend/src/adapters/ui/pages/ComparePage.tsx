import { useState } from 'react';
import { ComplianceApiService } from '../../infrastructure/api/ComplianceApiService';
import { useComparison } from '../../../core/application/useComparison';
import { CompareTable } from '../components/compare/CompareTable';
import { CompareChart } from '../components/compare/CompareChart';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { YEARS } from '../../../shared/constants';

const complianceService = new ComplianceApiService();

export function ComparePage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(YEARS[0]);
  const { comparisons, loading, error } = useComparison(complianceService, {
    year: selectedYear,
  });

  return (
    <div className="space-y-6">
      {/* ── Year selector ─────────────────────────────────── */}
      <div className="card">
        <label className="block text-sm font-medium text-slate-400 mb-3">
          Select Year
        </label>
        <select
          value={selectedYear ?? ''}
          onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
          className="input-field"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {error && <ErrorMessage message={error} />}

      {/* ── Chart ───────────────────────────────────────── */}
      {comparisons.length > 0 && <CompareChart comparisons={comparisons} />}

      {/* ── Table ───────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">
            Comparisons {!loading && `(${comparisons.length})`}
          </h2>
        </div>
        <CompareTable comparisons={comparisons} loading={loading} />
      </div>
    </div>
  );
}

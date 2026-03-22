import { useMemo } from 'react';
import { RouteApiService } from '../../infrastructure/api/RouteApiService';
import { useComparison }   from '../../../core/application/useComparison';
import { CompareTable }    from '../components/compare/CompareTable';
import { CompareChart }    from '../components/compare/CompareChart';
import { Spinner }         from '../components/shared/Spinner';
import { ErrorMessage }    from '../components/shared/ErrorMessage';
import { Badge }           from '../components/shared/Badge';
import { GHG_TARGET }      from '../../../shared/constants';

const routeService = new RouteApiService();

export function ComparePage() {
  const { comparisons, loading, error } = useComparison(routeService);

  const stats = useMemo(() => ({
    compliant:    comparisons.filter((c) => c.compliant).length,
    nonCompliant: comparisons.filter((c) => !c.compliant).length,
    baseline:     comparisons[0]?.baselineRouteId ?? '—',
    baselineVal:  comparisons[0]?.baselineIntensity ?? 0,
  }), [comparisons]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">

      {/* ── KPI strip ─────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Baseline Route',   value: stats.baseline },
          {
            label: 'Baseline GHG',
            value: `${stats.baselineVal.toFixed(2)} gCO₂e/MJ`,
          },
          { label: 'Compliant Routes', value: stats.compliant },
          { label: 'Non-Compliant',    value: stats.nonCompliant },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-slate-100">{value}</p>
            <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Target callout ────────────────────────────── */}
      <div className="card flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-amber-500/15
                        flex items-center justify-center shrink-0">
          <span className="text-amber-400 text-lg">⚡</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            FuelEU 2025 GHG Intensity Target
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {GHG_TARGET} gCO₂e/MJ — 2% below 2024 baseline of 91.16
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge label={`${stats.compliant} compliant`}    variant="green" />
          <Badge label={`${stats.nonCompliant} over limit`} variant="red"   />
        </div>
      </div>

      {/* ── Chart ─────────────────────────────────────── */}
      <div className="card">
        <h2 className="mb-6 text-sm font-semibold text-slate-400
                       uppercase tracking-wide">
          GHG Intensity Comparison
        </h2>
        <CompareChart
          comparisons={comparisons}
          baselineIntensity={stats.baselineVal}
          baselineRouteId={stats.baseline}
        />
        <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
          {[
            { color: 'bg-blue-500',    label: 'Baseline' },
            { color: 'bg-emerald-500', label: 'Compliant' },
            { color: 'bg-red-500',     label: 'Non-compliant' },
            { color: 'bg-amber-500',   label: 'Target line', dashed: true },
          ].map(({ color, label, dashed }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-sm ${color}
                ${dashed ? 'opacity-70' : ''}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">
            Detailed Comparison
          </h2>
        </div>
        <div className="p-4">
          <CompareTable comparisons={comparisons} />
        </div>
      </div>
    </div>
  );
}
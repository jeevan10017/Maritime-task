import { useMemo } from 'react';
import { RouteApiService }  from '../../infrastructure/api/RouteApiService';
import { useRoutes }        from '../../../core/application/useRoutes';
import { RouteFilters }     from '../components/routes/RouteFilters';
import { RouteTable }       from '../components/routes/RouteTable';
import { Spinner }          from '../components/shared/Spinner';
import { ErrorMessage }     from '../components/shared/ErrorMessage';

// Service instantiated once outside component — stable reference
const routeService = new RouteApiService();

export function RoutesPage() {
  const {
    routes,
    loading,
    error,
    filters,
    setFilters,
    baselineBusy,
    setBaseline,
  } = useRoutes(routeService);

  const stats = useMemo(() => ({
    total:      routes.length,
    compliant:  routes.filter((r) => r.ghgIntensity <= 89.3368).length,
    baseline:   routes.find((r) => r.isBaseline)?.routeId ?? '—',
  }), [routes]);

  return (
    <div className="space-y-6">

      {/* ── KPI strip ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Routes',    value: stats.total },
          { label: 'Compliant',       value: stats.compliant },
          { label: 'Active Baseline', value: stats.baseline },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-slate-100">{value}</p>
            <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────── */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-slate-400 uppercase
                       tracking-wide">
          Filters
        </h2>
        <RouteFilters filters={filters} onChange={setFilters} />
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">
            Routes
            {!loading && (
              <span className="ml-2 text-slate-500">
                ({routes.length})
              </span>
            )}
          </h2>
          {loading && <Spinner size="sm" />}
        </div>

        {error && (
          <div className="p-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {!error && (
          <RouteTable
            routes={routes}
            baselineBusy={baselineBusy}
            onSetBaseline={setBaseline}
          />
        )}
      </div>
    </div>
  );
}
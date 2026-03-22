import { useState } from 'react';
import { useRoutes } from '../../../core/application/useRoutes';
import { RouteApiService } from '../../infrastructure/api/RouteApiService';
import { usePooling } from '../../../core/application/usePooling';
import { MemberSelector } from '../components/pooling/MemberSelector';
import { PoolResult } from '../components/pooling/PoolResult';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Spinner } from '../components/shared/Spinner';
import { YEARS } from '../../../shared/constants';

const routeService = new RouteApiService();

export function PoolingPage() {
  const [year, setYear] = useState<number>(YEARS[0]);
  const [selectedRoutes, setSelectedRoutes] = useState<Map<number, any>>(new Map());

  const { routes, loading: routesLoading } = useRoutes(routeService, { year });
  const { members, poolBusy, error: poolError, result, addMember, createPool } = usePooling();

  const handleToggleRoute = (route: any) => {
    const newSelected = new Map(selectedRoutes);
    if (newSelected.has(route.id)) {
      newSelected.delete(route.id);
    } else {
      newSelected.set(route.id, route);
    }
    setSelectedRoutes(newSelected);
  };

  const handleCreatePool = async () => {
    try {
      await createPool(year);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Year selector ─────────────────────────────────── */}
      <div className="card">
        <label className="block text-sm font-medium text-slate-400 mb-3">
          Select Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="input-field"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ── Errors ────────────────────────────────────────── */}
      {poolError && <ErrorMessage message={poolError} />}

      {/* ── Result ────────────────────────────────────────── */}
      {result && (
        <PoolResult
          poolId={result.id}
          year={result.year}
          poolSum={result.poolSum}
          members={result.members}
          createdAt={result.createdAt}
        />
      )}

      {/* ── Member selector ───────────────────────────────── */}
      <MemberSelector
        routes={routes}
        selected={selectedRoutes}
        onToggle={handleToggleRoute}
        loading={routesLoading}
      />

      {/* ── Create button ────────────────────────────────── */}
      <div className="card">
        <button
          onClick={handleCreatePool}
          disabled={poolBusy || selectedRoutes.size < 2}
          className="btn-primary w-full justify-center"
        >
          {poolBusy ? (
            <>
              <Spinner size="sm" /> Creating pool...
            </>
          ) : (
            `Create Pool (${selectedRoutes.size} selected)`
          )}
        </button>
        {selectedRoutes.size < 2 && (
          <p className="text-xs text-slate-500 mt-2">
            Select at least 2 routes to create a pool
          </p>
        )}
      </div>
    </div>
  );
}

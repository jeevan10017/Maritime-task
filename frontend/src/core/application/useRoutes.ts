import { useState, useEffect, useCallback } from 'react';
import { IRouteService } from '../ports/IRouteService';
import { Route, RouteFilters } from '../domain/route';

interface UseRoutesState {
  routes:      Route[];
  loading:     boolean;
  error:       string | null;
  baselineBusy: number | null;  
}

export function useRoutes(service: IRouteService) {
  const [filters,   setFilters]   = useState<RouteFilters>({});
  const [state,     setState]     = useState<UseRoutesState>({
    routes:       [],
    loading:      true,
    error:        null,
    baselineBusy: null,
  });

  const fetchRoutes = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const routes = await service.getRoutes(filters);
      setState((s) => ({ ...s, routes, loading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load routes',
      }));
    }
  }, [service, filters]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const setBaseline = useCallback(
    async (routeId: number) => {
      setState((s) => ({ ...s, baselineBusy: routeId, error: null }));
      try {
        await service.setBaseline(routeId);
        await fetchRoutes();   // refresh list after change
      } catch (err) {
        setState((s) => ({
          ...s,
          baselineBusy: null,
          error: err instanceof Error ? err.message : 'Failed to set baseline',
        }));
      } finally {
        setState((s) => ({ ...s, baselineBusy: null }));
      }
    },
    [service, fetchRoutes]
  );

  return {
    ...state,
    filters,
    setFilters,
    refetch: fetchRoutes,
    setBaseline,
  };
}
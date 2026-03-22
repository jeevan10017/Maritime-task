import { useState, useEffect, useCallback } from 'react';
import { IComplianceService } from '../ports/IComplianceService';
import { RouteComparison, ComplianceFilters } from '../domain/compliance';

interface UseComparisonState {
  comparisons:  RouteComparison[];
  loading:      boolean;
  error:        string | null;
}

export function useComparison(service: IComplianceService, filters?: ComplianceFilters) {
  const [state, setState] = useState<UseComparisonState>({
    comparisons: [],
    loading:     true,
    error:       null,
  });

  const fetchComparisons = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await service.getComparisons(filters);
      setState((s) => ({ ...s, comparisons: data, loading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load comparisons',
      }));
    }
  }, [service, filters]);

  useEffect(() => { fetchComparisons(); }, [fetchComparisons]);

  return { ...state, refetch: fetchComparisons };
}

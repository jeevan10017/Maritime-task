import { useState, useEffect } from 'react';
import { IRouteService }   from '../ports/IRouteService';
import { RouteComparison } from '../domain/route';

interface State {
  comparisons: RouteComparison[];
  loading:     boolean;
  error:       string | null;
}

export function useComparison(service: IRouteService) {
  const [state, setState] = useState<State>({
    comparisons: [],
    loading:     true,
    error:       null,
  });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    service
      .getComparison()
      .then((comparisons) =>
        setState({ comparisons, loading: false, error: null })
      )
      .catch((err) =>
        setState({
          comparisons: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load comparison',
        })
      );
  }, [service]);

  return state;
}
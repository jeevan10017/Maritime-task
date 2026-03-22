import { useState, useCallback } from 'react';

export interface PoolMember {
  shipId: string;
  cbBefore: number;
}

interface UsePoolingState {
  members:   PoolMember[];
  loading:   boolean;
  error:     string | null;
  poolBusy:  boolean;
  result:    any | null;
}

export function usePooling() {
  const [state, setState] = useState<UsePoolingState>({
    members:   [],
    loading:   false,
    error:     null,
    poolBusy:  false,
    result:    null,
  });

  const addMember = useCallback((shipId: string, cbBefore: number) => {
    setState((s) => ({
      ...s,
      members: [...s.members, { shipId, cbBefore }],
    }));
  }, []);

  const removeMember = useCallback((shipId: string) => {
    setState((s) => ({
      ...s,
      members: s.members.filter((m) => m.shipId !== shipId),
    }));
  }, []);

  const createPool = useCallback(async (year: number) => {
    setState((s) => ({ ...s, poolBusy: true, error: null }));
    try {
      const response = await fetch('/api/v1/pools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, members: state.members }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create pool');
      }

      const data = await response.json();
      setState((s) => ({
        ...s,
        poolBusy: false,
        result: data.data,
        members: [],
      }));
      return data.data;
    } catch (err) {
      setState((s) => ({
        ...s,
        poolBusy: false,
        error: err instanceof Error ? err.message : 'Failed to create pool',
      }));
      throw err;
    }
  }, [state.members]);

  return { ...state, addMember, removeMember, createPool };
}

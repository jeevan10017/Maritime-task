import { useState, useCallback } from 'react';
import { IBankingService } from '../ports/IBankingService';
import { IComplianceService } from '../ports/IComplianceService';
import { AdjustedCB } from '../domain/compliance';
import { PoolResult } from '../domain/banking';

interface PoolingState {
  adjustedCBs: Record<string, AdjustedCB>;
  result:      PoolResult | null;
  loading:     boolean;
  error:       string | null;
  success:     string | null;
}

export function usePooling(
  complianceService: IComplianceService,
  bankingService:    IBankingService
) {
  const [state, setState] = useState<PoolingState>({
    adjustedCBs: {},
    result:      null,
    loading:     false,
    error:       null,
    success:     null,
  });

  const clearMessages = () =>
    setState((s) => ({ ...s, error: null, success: null }));

  // Fetch adjusted CB for a single ship
  const fetchAdjustedCB = useCallback(
    async (shipId: string, year: number) => {
      try {
        const cb = await complianceService.getAdjustedCB(shipId, year);
        setState((s) => ({
          ...s,
          adjustedCBs: { ...s.adjustedCBs, [shipId]: cb },
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error
            ? err.message
            : `Failed to load CB for ${shipId}`,
        }));
      }
    },
    [complianceService]
  );

  // Create pool
  const createPool = useCallback(
    async (year: number, shipIds: string[]) => {
      clearMessages();
      setState((s) => ({ ...s, loading: true, result: null }));
      try {
        const result = await bankingService.createPool(year, shipIds);
        setState((s) => ({
          ...s,
          result,
          loading: false,
          success: `Pool #${result.poolId} created successfully`,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Pool creation failed',
        }));
      }
    },
    [bankingService]
  );

  return { ...state, fetchAdjustedCB, createPool };
}
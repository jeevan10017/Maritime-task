import { useState, useCallback } from 'react';
import { IBankingService } from '../ports/IBankingService';
import { BankingSummary, BankSurplusInput, ApplyBankedInput } from '../domain/banking';

interface UseBankingState {
  summary:      BankingSummary | null;
  loading:      boolean;
  error:        string | null;
  bankingBusy:  boolean;
}

export function useBanking(service: IBankingService) {
  const [state, setState] = useState<UseBankingState>({
    summary:     null,
    loading:     true,
    error:       null,
    bankingBusy: false,
  });

  const fetchSummary = useCallback(
    async (shipId: string, year: number) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await service.getSummary(shipId, year);
        setState((s) => ({ ...s, summary: data, loading: false }));
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load summary',
        }));
      }
    },
    [service]
  );

  const bankSurplus = useCallback(
    async (input: BankSurplusInput) => {
      setState((s) => ({ ...s, bankingBusy: true, error: null }));
      try {
        const data = await service.bankSurplus(input);
        setState((s) => ({ ...s, summary: data, bankingBusy: false }));
      } catch (err) {
        setState((s) => ({
          ...s,
          bankingBusy: false,
          error: err instanceof Error ? err.message : 'Failed to bank surplus',
        }));
      }
    },
    [service]
  );

  const applyBanked = useCallback(
    async (input: ApplyBankedInput) => {
      setState((s) => ({ ...s, bankingBusy: true, error: null }));
      try {
        const amount = await service.applyBanked(input);
        setState((s) => ({ ...s, bankingBusy: false }));
        return amount;
      } catch (err) {
        setState((s) => ({
          ...s,
          bankingBusy: false,
          error: err instanceof Error ? err.message : 'Failed to apply banked credits',
        }));
        throw err;
      }
    },
    [service]
  );

  return { ...state, fetchSummary, bankSurplus, applyBanked };
}

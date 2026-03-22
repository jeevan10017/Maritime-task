import { useState, useCallback } from 'react';
import { IComplianceService } from '../ports/IComplianceService';
import { IBankingService }    from '../ports/IBankingService';
import { ComplianceBalance }  from '../domain/compliance';
import { BankingSummary, ApplyBankedResult } from '../domain/banking';

interface BankingState {
  cb:       ComplianceBalance | null;
  summary:  BankingSummary | null;
  loading:  boolean;
  error:    string | null;
  success:  string | null;
}

export function useBanking(
  complianceService: IComplianceService,
  bankingService:    IBankingService
) {
  const [state, setState] = useState<BankingState>({
    cb:      null,
    summary: null,
    loading: false,
    error:   null,
    success: null,
  });

  const clearMessages = () =>
    setState((s) => ({ ...s, error: null, success: null }));

  // Load CB + banking summary for a ship/year
  const loadShip = useCallback(
    async (shipId: string, year: number) => {
      clearMessages();
      setState((s) => ({ ...s, loading: true }));
      try {
        const [cb, summary] = await Promise.all([
          complianceService.computeCB(shipId, year),
          bankingService.getRecords(shipId, year),
        ]);
        setState((s) => ({ ...s, cb, summary, loading: false }));
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load ship data',
        }));
      }
    },
    [complianceService, bankingService]
  );

  // Bank surplus
  const bankSurplus = useCallback(
    async (shipId: string, year: number, amount: number) => {
      clearMessages();
      setState((s) => ({ ...s, loading: true }));
      try {
        await bankingService.bankSurplus(shipId, year, amount);
        const summary = await bankingService.getRecords(shipId, year);
        setState((s) => ({
          ...s,
          summary,
          loading: false,
          success: `Successfully banked ${amount.toLocaleString()} gCO₂e`,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Bank operation failed',
        }));
      }
    },
    [bankingService]
  );

  // Apply banked surplus
  const applyBanked = useCallback(
    async (
      shipId: string,
      year:   number,
      amount: number
    ): Promise<ApplyBankedResult | null> => {
      clearMessages();
      setState((s) => ({ ...s, loading: true }));
      try {
        const result  = await bankingService.applyBanked(shipId, year, amount);
        const summary = await bankingService.getRecords(shipId, year);
        setState((s) => ({
          ...s,
          summary,
          loading: false,
          success: `Applied ${result.applied.toLocaleString()} gCO₂e. CB: ${result.cbBefore.toLocaleString()} → ${result.cbAfter.toLocaleString()}`,
        }));
        return result;
      } catch (err) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Apply operation failed',
        }));
        return null;
      }
    },
    [bankingService]
  );

  return { ...state, loadShip, bankSurplus, applyBanked };
}
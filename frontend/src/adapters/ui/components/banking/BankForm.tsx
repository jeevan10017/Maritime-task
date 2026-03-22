import { useState } from 'react';
import { ComplianceBalance } from '../../../../core/domain/compliance';
import { BankingSummary }    from '../../../../core/domain/banking';
import { Spinner }           from '../shared/Spinner';

interface BankFormProps {
  cb:         ComplianceBalance;
  summary:    BankingSummary;
  loading:    boolean;
  onBank:     (amount: number) => void;
}

export function BankForm({ cb, summary, loading, onBank }: BankFormProps) {
  const [amount, setAmount] = useState('');
  const canBank  = cb.cbStatus === 'surplus' && cb.cbGco2eq > 0;
  const maxBank  = cb.cbGco2eq;
  const parsed   = parseFloat(amount);
  const valid    = !isNaN(parsed) && parsed > 0 && parsed <= maxBank;

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
        Bank Surplus (Article 20)
      </h3>

      {/* Current bank summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Total Banked</p>
          <p className="text-sm font-mono font-semibold text-slate-100">
            {summary.totalBanked.toLocaleString()} gCO₂e
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">Remaining in Bank</p>
          <p className="text-sm font-mono font-semibold text-emerald-400">
            {summary.totalRemaining.toLocaleString()} gCO₂e
          </p>
        </div>
      </div>

      {canBank ? (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5">
              Amount to bank (max: {maxBank.toLocaleString()} gCO₂e)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100000000"
              className="input-field w-full"
              min={1}
              max={maxBank}
            />
          </div>
          <button
            onClick={() => { onBank(parsed); setAmount(''); }}
            disabled={!valid || loading}
            className="btn-primary px-4 py-2 text-sm"
          >
            {loading ? <><Spinner size="sm" /> Banking…</> : 'Bank Surplus'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">
          Only surplus CB can be banked. This ship currently has a{' '}
          <span className="text-red-400">deficit</span>.
        </p>
      )}
    </div>
  );
}
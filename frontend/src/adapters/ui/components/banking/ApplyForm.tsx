import { useState } from 'react';
import { BankingSummary } from '../../../../core/domain/banking';
import { Spinner }        from '../shared/Spinner';

interface ApplyFormProps {
  summary:  BankingSummary;
  loading:  boolean;
  onApply:  (amount: number) => void;
}

export function ApplyForm({ summary, loading, onApply }: ApplyFormProps) {
  const [amount, setAmount] = useState('');
  const canApply = summary.totalRemaining > 0;
  const parsed   = parseFloat(amount);
  const valid    = !isNaN(parsed) && parsed > 0
                   && parsed <= summary.totalRemaining;

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
        Apply Banked Surplus
      </h3>

      {canApply ? (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5">
              Amount to apply (max: {summary.totalRemaining.toLocaleString()} gCO₂e)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000000"
              className="input-field w-full"
              min={1}
              max={summary.totalRemaining}
            />
          </div>
          <button
            onClick={() => { onApply(parsed); setAmount(''); }}
            disabled={!valid || loading}
            className="btn-primary px-4 py-2 text-sm"
          >
            {loading ? <><Spinner size="sm" /> Applying…</> : 'Apply'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">
          No banked surplus available to apply.
        </p>
      )}
    </div>
  );
}
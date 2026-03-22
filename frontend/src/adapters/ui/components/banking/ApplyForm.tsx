import { useState } from 'react';
import { ApplyBankedInput } from '../../../../core/domain/banking';
import { Spinner } from '../shared/Spinner';

interface ApplyFormProps {
  onSubmit: (input: ApplyBankedInput) => Promise<void>;
  loading: boolean;
  shipId: string;
  year: number;
  available: number;
}

export function ApplyForm({ onSubmit, loading, shipId, year, available }: ApplyFormProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount > available) {
      setError(`Not enough banked credits. Available: ${available.toFixed(2)}`);
      return;
    }

    try {
      await onSubmit({ shipId, year, amount: numAmount });
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply banked credits');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Apply Banked Credits</h3>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Amount (gCO₂e) — Available: {available.toFixed(2)}
        </label>
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to apply"
          className="input-field w-full"
          disabled={loading}
        />
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <>
            <Spinner size="sm" /> Applying...
          </>
        ) : (
          'Apply Credits'
        )}
      </button>
    </form>
  );
}

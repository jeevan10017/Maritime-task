import { ComplianceBalance } from '../../../../core/domain/compliance';
import { Badge } from '../shared/Badge';

interface CBCardProps {
  balance: ComplianceBalance | null;
  loading: boolean;
}

export function CBCard({ balance, loading }: CBCardProps) {
  if (loading) {
    return <div className="card text-center py-8 text-slate-500">Loading...</div>;
  }

  if (!balance) {
    return <div className="card text-center py-8 text-slate-500">No data available</div>;
  }

  const isPositive = balance.cbGco2eq > 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Carbon Credit Balance</p>
          <p className="text-3xl font-bold mt-2">
            <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
              {isPositive ? '+' : ''}{balance.cbGco2eq.toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 ml-2">gCO₂e</span>
          </p>
        </div>
        <Badge
          label={balance.status.charAt(0).toUpperCase() + balance.status.slice(1)}
          variant={
            balance.status === 'surplus' ? 'green'
            : balance.status === 'deficit' ? 'red'
            : 'slate'
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div>
          <p className="text-xs text-slate-500">Target Intensity</p>
          <p className="text-lg font-semibold text-slate-100 mt-1">
            {balance.targetIntensity.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Actual Intensity</p>
          <p className="text-lg font-semibold text-slate-100 mt-1">
            {balance.actualIntensity.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Year</p>
          <p className="text-lg font-semibold text-slate-100 mt-1">
            {balance.year}
          </p>
        </div>
      </div>
    </div>
  );
}

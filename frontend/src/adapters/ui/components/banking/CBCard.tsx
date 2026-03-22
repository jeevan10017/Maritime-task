import { ComplianceBalance } from '../../../../core/domain/compliance';
import { Badge } from '../shared/Badge';

interface CBCardProps {
  cb: ComplianceBalance;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export function CBCard({ cb }: CBCardProps) {
  const surplus = cb.cbStatus === 'surplus';

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Compliance Balance — {cb.shipId} ({cb.year})
        </h3>
        <Badge
          label={cb.cbStatus.toUpperCase()}
          variant={surplus ? 'green' : 'red'}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Target Intensity',  value: `${cb.targetIntensity} gCO₂e/MJ` },
          { label: 'Actual Intensity',  value: `${cb.actualIntensity} gCO₂e/MJ` },
          { label: 'Energy in Scope',   value: `${fmt(cb.energyInScope)} MJ`     },
          { label: 'CB (gCO₂e)',
            value: `${fmt(cb.cbGco2eq)}`,
            highlight: surplus ? 'text-emerald-400' : 'text-red-400',
          },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-sm font-semibold font-mono ${
              highlight ?? 'text-slate-100'
            }`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
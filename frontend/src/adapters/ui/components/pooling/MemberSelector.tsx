import { AdjustedCB } from '../../../../core/domain/compliance';
import { Badge }      from '../shared/Badge';

interface MemberSelectorProps {
  allShipIds:   string[];
  selected:     string[];
  adjustedCBs:  Record<string, AdjustedCB>;
  year:         number;
  onToggle:     (shipId: string) => void;
  onFetchCB:    (shipId: string) => void;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export function MemberSelector({
  allShipIds, selected, adjustedCBs, year, onToggle, onFetchCB,
}: MemberSelectorProps) {
  const poolSum = selected.reduce((s, id) => {
    const cb = adjustedCBs[id];
    return cb ? s + cb.adjustedCB : s;
  }, 0);

  const sumValid = poolSum >= 0;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase
                       tracking-wide">
          Pool Members
        </h3>
        {selected.length >= 2 && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5
                          text-xs font-semibold border ${
            sumValid
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            Pool Sum: {fmt(poolSum)} gCO₂e
            <span>{sumValid ? '✓' : '✗ Must be ≥ 0'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {allShipIds.map((id) => {
          const cb       = adjustedCBs[id];
          const isActive = selected.includes(id);

          return (
            <div
              key={id}
              className={`rounded-lg border p-3 cursor-pointer transition-all
                ${isActive
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}
              onClick={() => onToggle(id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-semibold text-slate-100 text-sm">
                  {id}
                </span>
                <input
                  type="checkbox"
                  readOnly
                  checked={isActive}
                  className="accent-brand-500 h-4 w-4"
                />
              </div>

              {cb ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Adjusted CB</span>
                    <Badge
                      label={cb.status}
                      variant={cb.status === 'surplus' ? 'green' : 'red'}
                    />
                  </div>
                  <p className={`text-xs font-mono font-semibold ${
                    cb.status === 'surplus'
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}>
                    {fmt(cb.adjustedCB)} gCO₂e
                  </p>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onFetchCB(id); }}
                  className="text-xs text-brand-400 hover:text-brand-300
                             transition-colors"
                >
                  Load CB for {year} →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
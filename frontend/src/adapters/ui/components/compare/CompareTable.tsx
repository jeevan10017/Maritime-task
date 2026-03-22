import { RouteComparison } from '../../../../core/domain/route';
import { Badge } from '../shared/Badge';
import { GHG_TARGET } from '../../../../shared/constants';

interface CompareTableProps {
  comparisons: RouteComparison[];
}

export function CompareTable({ comparisons }: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full border-collapse">
        <thead className="bg-slate-800/60">
          <tr>
            {[
              'Baseline Route', 'Baseline GHG',
              'Compare Route', 'Compare GHG',
              '% Difference', 'vs Target', 'Compliant',
            ].map((h) => <th key={h} className="th">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {comparisons.map((c) => {
            const diffPositive = c.percentDiff > 0;
            return (
              <tr
                key={c.comparisonRouteId}
                className="hover:bg-slate-800/40 transition-colors"
              >
                <td className="td font-mono font-semibold text-brand-400">
                  {c.baselineRouteId}
                </td>
                <td className="td font-mono">
                  {c.baselineIntensity.toFixed(2)}
                  <span className="ml-1 text-xs text-slate-500">gCO₂e/MJ</span>
                </td>
                <td className="td font-mono font-semibold text-slate-100">
                  {c.comparisonRouteId}
                </td>
                <td className="td">
                  <span className={`font-mono font-semibold ${
                    c.compliant ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {c.comparisonIntensity.toFixed(2)}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">gCO₂e/MJ</span>
                </td>
                <td className="td">
                  <span className={`font-mono font-semibold ${
                    diffPositive ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {diffPositive ? '+' : ''}
                    {c.percentDiff.toFixed(2)}%
                  </span>
                </td>
                <td className="td font-mono text-xs text-slate-400">
                  Target: {GHG_TARGET}
                </td>
                <td className="td">
                  <Badge
                    label={c.compliant ? '✓ Compliant' : '✗ Non-compliant'}
                    variant={c.compliant ? 'green' : 'red'}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
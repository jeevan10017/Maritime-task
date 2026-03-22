import { RouteComparison } from '../../../../core/domain/compliance';
import { Badge } from '../shared/Badge';
import { GHG_TARGET } from '../../../../shared/constants';

interface CompareTableProps {
  comparisons: RouteComparison[];
  loading:     boolean;
}

export function CompareTable({ comparisons, loading }: CompareTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading comparisons...</div>;
  }

  if (comparisons.length === 0) {
    return <div className="text-center py-8 text-slate-500">No comparisons available</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full border-collapse">
        <thead className="bg-slate-800/60">
          <tr>
            {[
              'Baseline Route',
              'Baseline Intensity',
              'Comparison Route',
              'Comparison Intensity',
              'Diff %',
              'Compliant',
            ].map((h) => (
              <th key={h} className="th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {comparisons.map((comp, idx) => (
            <tr key={idx} className="hover:bg-slate-800/40 transition">
              <td className="td font-mono font-semibold">{comp.baselineRouteId}</td>
              <td className="td">
                <span className="text-emerald-400 font-semibold">
                  {comp.baselineIntensity.toFixed(2)}
                </span>
              </td>
              <td className="td font-mono font-semibold">{comp.comparisonRouteId}</td>
              <td className="td">
                <span
                  className={`font-semibold ${
                    comp.compliant ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {comp.comparisonIntensity.toFixed(2)}
                </span>
              </td>
              <td className="td">
                <span className={comp.percentDiff > 0 ? 'text-red-400' : 'text-emerald-400'}>
                  {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff.toFixed(2)}%
                </span>
              </td>
              <td className="td">
                <Badge
                  label={comp.compliant ? '✓ Compliant' : '✗ Non-compliant'}
                  variant={comp.compliant ? 'green' : 'red'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { PoolResult as PR } from '../../../../core/domain/banking';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export function PoolResult({ result }: { result: PR }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase
                       tracking-wide">
          Pool #{result.poolId} — Created
        </h3>
        <span className="text-xs text-slate-500">
          {new Date(result.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full border-collapse">
          <thead className="bg-slate-800/60">
            <tr>
              {['Ship', 'CB Before', 'CB After', 'Delta'].map((h) => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {result.members.map((m) => {
              const positive = m.delta >= 0;
              return (
                <tr key={m.shipId}
                    className="hover:bg-slate-800/40 transition-colors">
                  <td className="td font-mono font-semibold text-slate-100">
                    {m.shipId}
                  </td>
                  <td className="td font-mono text-slate-400">
                    {fmt(m.cbBefore)}
                  </td>
                  <td className={`td font-mono font-semibold ${
                    m.cbAfter >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {fmt(m.cbAfter)}
                  </td>
                  <td className={`td font-mono font-semibold ${
                    positive ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {positive ? '+' : ''}{fmt(m.delta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-800/40 border-t border-slate-700">
            <tr>
              <td className="th" colSpan={3}>Pool Sum</td>
              <td className="td font-mono font-bold text-emerald-400">
                {fmt(result.poolSum)} gCO₂e
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
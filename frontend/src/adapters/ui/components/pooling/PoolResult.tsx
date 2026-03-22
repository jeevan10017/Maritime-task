import { Badge } from '../shared/Badge';

interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
  delta: number;
}

interface PoolResultProps {
  poolId: number;
  year: number;
  poolSum: number;
  members: PoolMember[];
  createdAt: string;
}

export function PoolResult({ poolId, year, poolSum, members, createdAt }: PoolResultProps) {
  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Pool Created Successfully</h3>

      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/50 rounded">
        <div>
          <p className="text-xs text-slate-500">Pool ID</p>
          <p className="font-mono text-sm font-semibold text-slate-100">{poolId}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Year</p>
          <p className="font-mono text-sm font-semibold text-slate-100">{year}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Pool Sum</p>
          <p className="font-mono text-sm font-semibold text-slate-100">
            {poolSum.toFixed(2)} gCO₂e
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60">
            <tr>
              <th className="th">Ship ID</th>
              <th className="th">CB Before</th>
              <th className="th">CB After</th>
              <th className="th">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map((m) => (
              <tr key={m.shipId} className="hover:bg-slate-800/40">
                <td className="td font-mono">{m.shipId}</td>
                <td className="td">
                  <span className={m.cbBefore > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {m.cbBefore.toFixed(2)}
                  </span>
                </td>
                <td className="td">
                  <span className={m.cbAfter > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {m.cbAfter.toFixed(2)}
                  </span>
                </td>
                <td className="td">
                  <Badge
                    label={`${m.delta > 0 ? '+' : ''}${m.delta.toFixed(2)}`}
                    variant={m.delta > 0 ? 'green' : m.delta < 0 ? 'red' : 'slate'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Created: {new Date(createdAt).toLocaleString()}
      </p>
    </div>
  );
}

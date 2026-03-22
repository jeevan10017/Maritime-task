import { Route } from '../../../../core/domain/route';
import { Badge }   from '../shared/Badge';
import { Spinner } from '../shared/Spinner';
import { GHG_TARGET } from '../../../../shared/constants';
import { Anchor } from 'lucide-react';

interface RouteTableProps {
  routes:       Route[];
  baselineBusy: number | null;
  onSetBaseline: (id: number) => void;
}

export function RouteTable({
  routes,
  baselineBusy,
  onSetBaseline,
}: RouteTableProps) {
  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16
                      text-slate-500 gap-3">
        <Anchor className="h-10 w-10 opacity-30" />
        <p className="text-sm">No routes match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full border-collapse">
        <thead className="bg-slate-800/60">
          <tr>
            {[
              'Route ID', 'Vessel Type', 'Fuel', 'Year',
              'GHG Intensity', 'Fuel Cons. (t)', 'Distance (km)',
              'Emissions (t)', 'Status', 'Actions',
            ].map((h) => (
              <th key={h} className="th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {routes.map((route) => {
            const compliant  = route.ghgIntensity <= GHG_TARGET;
            const isBusy     = baselineBusy === route.id;

            return (
              <tr
                key={route.id}
                className={`transition-colors hover:bg-slate-800/40
                  ${route.isBaseline ? 'bg-brand-900/20' : ''}`}
              >
                <td className="td font-mono font-semibold text-slate-100">
                  {route.routeId}
                  {route.isBaseline && (
                    <span className="ml-2 text-[10px] font-bold
                                     text-brand-400 uppercase tracking-wide">
                      baseline
                    </span>
                  )}
                </td>
                <td className="td">{route.vesselType}</td>
                <td className="td">
                  <Badge
                    label={route.fuelType}
                    variant={
                      route.fuelType === 'LNG' ? 'blue'
                      : route.fuelType === 'MGO' ? 'yellow'
                      : 'slate'
                    }
                  />
                </td>
                <td className="td">{route.year}</td>
                <td className="td">
                  <span
                    className={`font-mono font-semibold ${
                      compliant ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {route.ghgIntensity.toFixed(2)}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">
                    gCO₂e/MJ
                  </span>
                </td>
                <td className="td font-mono">
                  {route.fuelConsumption.toLocaleString()}
                </td>
                <td className="td font-mono">
                  {route.distance.toLocaleString()}
                </td>
                <td className="td font-mono">
                  {route.totalEmissions.toLocaleString()}
                </td>
                <td className="td">
                  <Badge
                    label={compliant ? '✓ Compliant' : '✗ Non-compliant'}
                    variant={compliant ? 'green' : 'red'}
                  />
                </td>
                <td className="td">
                  {route.isBaseline ? (
                    <span className="text-xs text-slate-600 italic">
                      current baseline
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetBaseline(route.id)}
                      disabled={isBusy || baselineBusy !== null}
                      className="btn-primary"
                    >
                      {isBusy ? (
                        <><Spinner size="sm" /> Setting…</>
                      ) : (
                        'Set Baseline'
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
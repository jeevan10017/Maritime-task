import { Route } from '../../../../core/domain/route';
import { Badge } from '../shared/Badge';
import { Spinner } from '../shared/Spinner';

interface MemberSelectorProps {
  routes: Route[];
  selected: Map<number, Route>;
  onToggle: (route: Route) => void;
  loading: boolean;
}

export function MemberSelector({ routes, selected, onToggle, loading }: MemberSelectorProps) {
  if (loading) {
    return <div className="card text-center py-8"><Spinner /></div>;
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Select Pool Members (min 2)</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {routes.length === 0 ? (
          <p className="text-slate-500 text-sm">No routes available</p>
        ) : (
          routes.map((route) => (
            <label key={route.id} className="flex items-center gap-3 p-3 rounded hover:bg-slate-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(route.id)}
                onChange={() => onToggle(route)}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-mono font-semibold text-slate-100 text-sm">
                  {route.routeId}
                </p>
                <p className="text-xs text-slate-500">
                  {route.origin} → {route.destination}
                </p>
              </div>
              <Badge
                label={route.isBaseline ? 'Baseline' : 'Comparison'}
                variant={route.isBaseline ? 'blue' : 'slate'}
              />
            </label>
          ))
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Selected: {selected.size} route(s)
      </p>
    </div>
  );
}

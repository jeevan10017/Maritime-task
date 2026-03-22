import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RouteComparison } from '../../../../core/domain/compliance';
import { GHG_TARGET } from '../../../../shared/constants';

interface CompareChartProps {
  comparisons: RouteComparison[];
}

export function CompareChart({ comparisons }: CompareChartProps) {
  const data = comparisons.map((comp) => ({
    baseline: comp.baselineIntensity,
    comparison: comp.comparisonIntensity,
    target: GHG_TARGET,
    compliant: comp.compliant,
  }));

  return (
    <div className="card h-80">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">
        GHG Intensity Comparison
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar dataKey="baseline" fill="#2563eb" name="Baseline" />
          <Bar dataKey="comparison" fill="#8b5cf6" name="Comparison" />
          <Bar dataKey="target" fill="#10b981" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { RouteComparison } from '../../../../core/domain/route';
import { GHG_TARGET } from '../../../../shared/constants';

interface CompareChartProps {
  comparisons:       RouteComparison[];
  baselineIntensity: number;
  baselineRouteId:   string;
}

export function CompareChart({
  comparisons,
  baselineIntensity,
  baselineRouteId,
}: CompareChartProps) {
  const data = [
    {
      routeId:      baselineRouteId,
      ghgIntensity: baselineIntensity,
      isBaseline:   true,
    },
    ...comparisons.map((c) => ({
      routeId:      c.comparisonRouteId,
      ghgIntensity: c.comparisonIntensity,
      isBaseline:   false,
      compliant:    c.compliant,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e293b"
          vertical={false}
        />
        <XAxis
          dataKey="routeId"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
        />
        <YAxis
          domain={[85, 96]}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          label={{
            value: 'gCO₂e/MJ',
            angle: -90,
            position: 'insideLeft',
            fill: '#64748b',
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            background:   '#0f172a',
            border:       '1px solid #1e293b',
            borderRadius: '8px',
            fontSize:     '12px',
            color:        '#e2e8f0',
          }}
          formatter={(value: number) => [
            `${value.toFixed(2)} gCO₂e/MJ`,
            'GHG Intensity',
          ]}
        />
        {/* Regulation target line */}
        <ReferenceLine
          y={GHG_TARGET}
          stroke="#f59e0b"
          strokeDasharray="5 4"
          label={{
            value:    `Target ${GHG_TARGET}`,
            position: 'insideTopRight',
            fill:     '#f59e0b',
            fontSize: 11,
          }}
        />
        <Bar dataKey="ghgIntensity" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.isBaseline
                  ? '#3b82f6'
                  : entry.compliant
                  ? '#10b981'
                  : '#ef4444'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
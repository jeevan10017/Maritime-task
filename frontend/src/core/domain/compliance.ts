// Domain types for compliance (GHG intensity, carbon credit tracking)

export interface ComplianceBalance {
  shipId:          string;
  year:            number;
  targetIntensity: number;     // FuelEU target (89.3368 gCO₂e/MJ)
  actualIntensity: number;     // Actual GHG intensity
  cbGco2eq:        number;     // Carbon credit balance (+ = surplus, - = deficit)
  status:          'surplus' | 'deficit' | 'exact';
  computedAt:      string;
}

export interface RouteComparison {
  baselineRouteId:     string;
  baselineIntensity:   number;
  comparisonRouteId:   string;
  comparisonIntensity: number;
  percentDiff:         number;
  compliant:           boolean;
}

export interface ComplianceFilters {
  year?: number;
  shipId?: string;
}

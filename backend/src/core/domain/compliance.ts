
export interface ComplianceBalance {
  shipId:        string;
  year:          number;
  targetIntensity: number;   
  actualIntensity: number;  
  energyInScope:   number;  
  cbGco2eq:        number;   
  status:          'surplus' | 'deficit' | 'exact';
  computedAt:      Date;
}


export interface RouteComparison {
  baselineRouteId:    string;
  baselineIntensity:  number;
  comparisonRouteId:  string;
  comparisonIntensity: number;
  percentDiff:        number;  
  compliant:          boolean;  
}

export interface Route {
  id:              number;
  routeId:         string;
  vesselType:      string;
  fuelType:        string;
  year:            number;
  ghgIntensity:    number;
  fuelConsumption: number;
  distance:        number;
  totalEmissions:  number;
  isBaseline:      boolean;
  createdAt:       string;
  updatedAt:       string;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?:   string;
  year?:       number;
}

export interface RouteComparison {
  baselineRouteId:     string;
  baselineIntensity:   number;
  comparisonRouteId:   string;
  comparisonIntensity: number;
  percentDiff:         number;
  compliant:           boolean;
}
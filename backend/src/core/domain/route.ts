
export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo';
export type FuelType   = 'HFO' | 'LNG' | 'MGO';

export interface Route {
  id:               number;
  routeId:          string;
  vesselType:       VesselType;
  fuelType:         FuelType;
  year:             number;
  ghgIntensity:     number;   // gCO₂e/MJ
  fuelConsumption:  number;   // tonnes
  distance:         number;   // km
  totalEmissions:   number;   // tonnes
  isBaseline:       boolean;
  createdAt:        Date;
  updatedAt:        Date;
}

// Filter shape used by the GetRoutes use-case
export interface RouteFilters {
  vesselType?: VesselType;
  fuelType?:   FuelType;
  year?:       number;
}
export const GHG_TARGET = 89.3368;  
export const VESSEL_TYPES = [
  'Container',
  'BulkCarrier',
  'Tanker',
  'RoRo',
] as const;

export const FUEL_TYPES = ['HFO', 'LNG', 'MGO'] as const;

export const YEARS = [2024, 2025] as const;

export type VesselType = (typeof VESSEL_TYPES)[number];
export type FuelType   = (typeof FUEL_TYPES)[number];
export interface ComplianceBalance {
  shipId:          string;
  year:            number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope:   number;
  cbGco2eq:        number;
  cbStatus:        'surplus' | 'deficit' | 'exact';
  computedAt:      string;
}

export interface AdjustedCB {
  shipId:        string;
  year:          number;
  rawCB:         number;
  bankedApplied: number;
  adjustedCB:    number;
  status:        'surplus' | 'deficit' | 'exact';
}
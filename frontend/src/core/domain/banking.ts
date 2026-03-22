// Domain types for carbon banking (credit accumulation & consumption)

export interface BankEntry {
  id:           number;
  shipId:       string;
  year:         number;
  amountGco2eq: number;      // Credits banked (positive) or consumed (negative)
  remaining:    number;      // Balance still available
  createdAt:    string;
}

export interface BankingSummary {
  shipId:        string;
  year:          number;
  totalBanked:   number;     // Sum of all amountGco2eq
  totalRemaining: number;    // Sum of all remaining
  entries:       BankEntry[];
}

export interface BankSurplusInput {
  shipId: string;
  year:   number;
  amount: number;   // Must be > 0 and ≤ current surplus CB
}

export interface ApplyBankedInput {
  shipId: string;
  year:   number;
  amount: number;   // Amount to consume from bank
}

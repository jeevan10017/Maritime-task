

export interface BankEntry {
  id:           number;
  shipId:       string;
  year:         number;
  amountGco2eq: number;   
  remaining:    number;  
  createdAt:    Date;
}

// Aggregated view returned to callers
export interface BankingSummary {
  shipId:        string;
  year:          number;
  totalBanked:   number;   // sum of all amountGco2eq
  totalRemaining: number;  // sum of all remaining
  entries:       BankEntry[];
}

// Input shapes for use-cases
export interface BankSurplusInput {
  shipId: string;
  year:   number;
  amount: number;   // must be > 0 and ≤ current surplus CB
}

export interface ApplyBankedInput {
  shipId: string;
  year:   number;
  amount: number;   // must be > 0 and ≤ totalRemaining
}

// Result returned after applying banked surplus
export interface ApplyBankedResult {
  shipId:          string;
  year:            number;
  applied:         number;
  remainingInBank: number;
  cbBefore:        number;
  cbAfter:         number;
}
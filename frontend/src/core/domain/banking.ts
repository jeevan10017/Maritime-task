export interface BankEntry {
  id:           number;
  shipId:       string;
  year:         number;
  amountGco2eq: number;
  remaining:    number;
  createdAt:    string;
}

export interface BankingSummary {
  shipId:         string;
  year:           number;
  totalBanked:    number;
  totalRemaining: number;
  entries:        BankEntry[];
}

export interface ApplyBankedResult {
  shipId:          string;
  year:            number;
  applied:         number;
  remainingInBank: number;
  cbBefore:        number;
  cbAfter:         number;
}

export interface PoolMember {
  shipId:   string;
  cbBefore: number;
  cbAfter:  number;
  delta:    number;
}

export interface PoolResult {
  poolId:    number;
  year:      number;
  poolSum:   number;
  createdAt: string;
  members:   PoolMember[];
}
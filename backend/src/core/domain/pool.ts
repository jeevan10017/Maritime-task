export interface PoolMember {
  shipId:   string;
  cbBefore: number;
  cbAfter:  number;
}

export interface Pool {
  id:        number;
  year:      number;
  members:   PoolMember[];
  poolSum:   number;      // sum of cbBefore values
  createdAt: Date;
}

export interface CreatePoolInput {
  year:    number;
  members: Array<{ shipId: string; cbBefore: number }>;
}

export interface AllocationResult {
  members: PoolMember[];
  poolSum: number;
  valid:   boolean;
  reason?: string;  // Error message when valid is false
}

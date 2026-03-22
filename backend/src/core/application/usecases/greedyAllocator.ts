
import { AllocationResult, PoolMember } from '../../domain/pool';

export interface AllocatorMember {
  shipId:   string;
  cbBefore: number;
}

export function greedyAllocate(
  members: AllocatorMember[]
): AllocationResult {
  
  const poolSum = members.reduce((s, m) => s + m.cbBefore, 0);

  if (poolSum < 0) {
    return {
      members: members.map((m) => ({
        shipId:   m.shipId,
        cbBefore: m.cbBefore,
        cbAfter:  m.cbBefore,   
      })),
      poolSum,
      valid:  false,
      reason: `Pool sum is ${poolSum.toFixed(2)} gCO₂e — must be ≥ 0 (Article 21).`,
    };
  }

  // Work on mutable copies so we don't mutate input
  const working = members.map((m) => ({
    shipId:   m.shipId,
    cbBefore: m.cbBefore,
    cbAfter:  m.cbBefore,  
  }));

  // Sort descending by cbBefore — largest surplus donates first
  const sorted = [...working].sort((a, b) => b.cbBefore - a.cbBefore);

  // Identify surplus donors and deficit receivers
  const donors    = sorted.filter((m) => m.cbBefore > 0);
  const receivers = sorted.filter((m) => m.cbBefore < 0);

  // FIFO greedy transfer: each receiver gets filled from donors in order
  for (const receiver of receivers) {
    let deficit = Math.abs(receiver.cbAfter);   // how much it still needs

    for (const donor of donors) {
      if (deficit <= 0) break;
      if (donor.cbAfter <= 0) continue;         // donor exhausted

      const transfer = Math.min(donor.cbAfter, deficit);

      donor.cbAfter    -= transfer;
      receiver.cbAfter += transfer;
      deficit          -= transfer;
    }
  }

  // 
  for (const m of working) {
    if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
      return {
        members: working,
        poolSum,
        valid:   false,
        reason:  `Ship "${m.shipId}" would exit worse than it entered ` +
                 `(before: ${m.cbBefore}, after: ${m.cbAfter}).`,
      };
    }
  }

  // 
  for (const m of working) {
    if (m.cbBefore > 0 && m.cbAfter < 0) {
      return {
        members: working,
        poolSum,
        valid:   false,
        reason:  `Surplus ship "${m.shipId}" would exit with negative CB ` +
                 `(${m.cbAfter.toFixed(2)} gCO₂e).`,
      };
    }
  }

  // Round to 4 decimal places for storage
  const result: PoolMember[] = working.map((m) => ({
    shipId:   m.shipId,
    cbBefore: parseFloat(m.cbBefore.toFixed(4)),
    cbAfter:  parseFloat(m.cbAfter.toFixed(4)),
  }));

  return { members: result, poolSum, valid: true };
}
import { IRouteRepository }      from '../../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { ComplianceBalance }     from '../../domain/compliance';
import {
  GHG_TARGET_GCO2E_PER_MJ,
  ENERGY_CONVERSION_MJ_PER_TONNE,
} from '../../domain/constants';
import { DomainError } from './SetBaseline';

export interface ComputeCBInput {
  shipId: string;   // maps to routeId for now
  year:   number;
}

export class ComputeCB {
  constructor(
    private readonly routeRepo:      IRouteRepository,
    private readonly complianceRepo: IComplianceRepository
  ) {}

  async execute(input: ComputeCBInput): Promise<ComplianceBalance> {
    const { shipId, year } = input;

    // Resolve ship → route (routeId used as shipId in this data model)
    const routes = await this.routeRepo.findAll({ year });
    const route  = routes.find((r) => r.routeId === shipId);

    if (!route) {
      throw new DomainError(
        `No route found for shipId "${shipId}" in year ${year}`,
        404
      );
    }

    const energyInScope = route.fuelConsumption * ENERGY_CONVERSION_MJ_PER_TONNE;

    const cbGco2eq =
      (GHG_TARGET_GCO2E_PER_MJ - route.ghgIntensity) * energyInScope;

    const status: ComplianceBalance['status'] =
      cbGco2eq > 0 ? 'surplus'
      : cbGco2eq < 0 ? 'deficit'
      : 'exact';

    const snapshot: ComplianceBalance = {
      shipId,
      year,
      targetIntensity: GHG_TARGET_GCO2E_PER_MJ,
      actualIntensity: route.ghgIntensity,
      energyInScope,
      cbGco2eq:        parseFloat(cbGco2eq.toFixed(4)),
      status,
      computedAt:      new Date(),
    };

    // Persist snapshot (upsert)
    return this.complianceRepo.saveSnapshot(snapshot);
  }
}
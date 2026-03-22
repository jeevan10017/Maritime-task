import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { RouteComparison }  from '../../domain/compliance';
import { GHG_TARGET_GCO2E_PER_MJ } from '../../domain/constants';
import { DomainError } from './SetBaseline';

export class GetComparison {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(): Promise<RouteComparison[]> {
    const allRoutes = await this.routeRepo.findAll({});

    const baseline = allRoutes.find((r) => r.isBaseline);

    if (!baseline) {
      throw new DomainError(
        'No baseline route set. Use POST /routes/:id/baseline first.',
        422
      );
    }

    const comparisons = allRoutes
      .filter((r) => !r.isBaseline)
      .map((route) => {
        const percentDiff =
          ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

        const compliant = route.ghgIntensity <= GHG_TARGET_GCO2E_PER_MJ;

        return {
          baselineRouteId:     baseline.routeId,
          baselineIntensity:   baseline.ghgIntensity,
          comparisonRouteId:   route.routeId,
          comparisonIntensity: route.ghgIntensity,
          percentDiff:         parseFloat(percentDiff.toFixed(4)),
          compliant,
        } satisfies RouteComparison;
      });

    return comparisons;
  }
}
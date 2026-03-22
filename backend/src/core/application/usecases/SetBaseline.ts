import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { Route } from '../../domain/route';

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class SetBaseline {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(routeId: number): Promise<Route> {
    // Verify the route actually 
    const existing = await this.routeRepo.findById(routeId);

    if (!existing) {
      throw new DomainError(
        `Route with id ${routeId} not found`,
        404
      );
    }

    if (existing.isBaseline) {
      throw new DomainError(
        `Route ${existing.routeId} is already the baseline`
      );
    }

    return this.routeRepo.setBaseline(routeId);
  }
}
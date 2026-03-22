import { Pool, PoolMember } from '../../domain/pool';

export interface IPoolRepository {
  createPool(
    year:    number,
    members: PoolMember[]
  ): Promise<Pool>;

  findById(poolId: number): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}
import 'dotenv/config';
import pool, { checkDbConnection } from './client';

interface RouteRow {
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: number;
  fuel_consumption: number;
  distance: number;
  total_emissions: number;
  is_baseline: boolean;
}

const ROUTES: RouteRow[] = [
  {
    route_id: 'R001',
    vessel_type: 'Container',
    fuel_type: 'HFO',
    year: 2024,
    ghg_intensity: 91.0,
    fuel_consumption: 5000,
    distance: 12000,
    total_emissions: 4500,
    is_baseline: true,   // ← R001 is the baseline
  },
  {
    route_id: 'R002',
    vessel_type: 'BulkCarrier',
    fuel_type: 'LNG',
    year: 2024,
    ghg_intensity: 88.0,
    fuel_consumption: 4800,
    distance: 11500,
    total_emissions: 4200,
    is_baseline: false,
  },
  {
    route_id: 'R003',
    vessel_type: 'Tanker',
    fuel_type: 'MGO',
    year: 2024,
    ghg_intensity: 93.5,
    fuel_consumption: 5100,
    distance: 12500,
    total_emissions: 4700,
    is_baseline: false,
  },
  {
    route_id: 'R004',
    vessel_type: 'RoRo',
    fuel_type: 'HFO',
    year: 2025,
    ghg_intensity: 89.2,
    fuel_consumption: 4900,
    distance: 11800,
    total_emissions: 4300,
    is_baseline: false,
  },
  {
    route_id: 'R005',
    vessel_type: 'Container',
    fuel_type: 'LNG',
    year: 2025,
    ghg_intensity: 90.5,
    fuel_consumption: 4950,
    distance: 11900,
    total_emissions: 4400,
    is_baseline: false,
  },
];

async function seed(): Promise<void> {
  await checkDbConnection();

  console.log('[Seed] Seeding routes...');

  for (const route of ROUTES) {
    await pool.query(
      `INSERT INTO routes
         (route_id, vessel_type, fuel_type, year, ghg_intensity,
          fuel_consumption, distance, total_emissions, is_baseline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (route_id) DO UPDATE SET
         vessel_type      = EXCLUDED.vessel_type,
         fuel_type        = EXCLUDED.fuel_type,
         year             = EXCLUDED.year,
         ghg_intensity    = EXCLUDED.ghg_intensity,
         fuel_consumption = EXCLUDED.fuel_consumption,
         distance         = EXCLUDED.distance,
         total_emissions  = EXCLUDED.total_emissions,
         is_baseline      = EXCLUDED.is_baseline,
         updated_at       = NOW()`,
      [
        route.route_id,
        route.vessel_type,
        route.fuel_type,
        route.year,
        route.ghg_intensity,
        route.fuel_consumption,
        route.distance,
        route.total_emissions,
        route.is_baseline,
      ]
    );
    console.log(`[Seed]  ✅ Upserted route ${route.route_id}`);
  }

  console.log('[Seed] Done.');
  await pool.end();
}

seed().catch((err) => {
  console.error('[Seed] Fatal error:', err);
  process.exit(1);
});
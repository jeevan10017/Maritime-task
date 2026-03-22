CREATE TABLE IF NOT EXISTS routes (
  id             SERIAL PRIMARY KEY,
  route_id       VARCHAR(20)    NOT NULL UNIQUE,
  vessel_type    VARCHAR(50)    NOT NULL,
  fuel_type      VARCHAR(50)    NOT NULL,
  year           SMALLINT       NOT NULL,
  ghg_intensity  NUMERIC(10, 4) NOT NULL,  -- gCO2e/MJ
  fuel_consumption NUMERIC(12, 2) NOT NULL, -- tonnes
  distance       NUMERIC(12, 2) NOT NULL,  -- km
  total_emissions NUMERIC(12, 2) NOT NULL, -- tonnes
  is_baseline    BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Only one baseline allowed at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_routes_single_baseline
  ON routes (is_baseline)
  WHERE is_baseline = TRUE;

CREATE INDEX IF NOT EXISTS idx_routes_year        ON routes (year);
CREATE INDEX IF NOT EXISTS idx_routes_vessel_type ON routes (vessel_type);
CREATE INDEX IF NOT EXISTS idx_routes_fuel_type   ON routes (fuel_type);
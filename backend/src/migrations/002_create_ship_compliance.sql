CREATE TABLE IF NOT EXISTS ship_compliance (
  id           SERIAL PRIMARY KEY,
  ship_id      VARCHAR(50)    NOT NULL,
  year         SMALLINT       NOT NULL,
  cb_gco2eq    NUMERIC(18, 4) NOT NULL,  -- Compliance Balance in gCO2e
  computed_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  UNIQUE (ship_id, year)
);

CREATE INDEX IF NOT EXISTS idx_ship_compliance_ship_year
  ON ship_compliance (ship_id, year);
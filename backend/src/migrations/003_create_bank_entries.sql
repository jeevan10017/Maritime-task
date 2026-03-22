CREATE TABLE IF NOT EXISTS bank_entries (
  id            SERIAL PRIMARY KEY,
  ship_id       VARCHAR(50)    NOT NULL,
  year          SMALLINT       NOT NULL,
  amount_gco2eq NUMERIC(18, 4) NOT NULL CHECK (amount_gco2eq > 0),
  remaining     NUMERIC(18, 4) NOT NULL,  -- how much is still available
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_entries_ship_year
  ON bank_entries (ship_id, year);
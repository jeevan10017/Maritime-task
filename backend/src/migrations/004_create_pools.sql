CREATE TABLE IF NOT EXISTS pools (
  id         SERIAL PRIMARY KEY,
  year       SMALLINT    NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pool_members (
  id        SERIAL PRIMARY KEY,
  pool_id   INTEGER        NOT NULL REFERENCES pools (id) ON DELETE CASCADE,
  ship_id   VARCHAR(50)    NOT NULL,
  cb_before NUMERIC(18, 4) NOT NULL,
  cb_after  NUMERIC(18, 4) NOT NULL,

  UNIQUE (pool_id, ship_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_members_pool_id ON pool_members (pool_id);
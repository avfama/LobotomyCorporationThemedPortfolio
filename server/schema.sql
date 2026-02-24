CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Alerts table: stores alert log entries from the frontend
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text, -- front-end generated id (e.g. A-...)
  created_at timestamptz NOT NULL DEFAULT now(),
  message text NOT NULL,
  severity text,
  source text,
  read boolean DEFAULT false,
  metadata jsonb
);

-- Containment units table: explicit columns that map to frontend unit fields
CREATE TABLE IF NOT EXISTS public.containment_units (
  unit_id text PRIMARY KEY, -- maps to frontend `id`
  name text,
  risk_level text,
  status text,
  work_count integer,
  qliphoth_counter numeric,
  max_qliphoth numeric,
  breached boolean NOT NULL DEFAULT false,
  last_breached timestamptz,
  metadata jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_containment_units_breached ON public.containment_units (breached);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts (created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_external_id ON public.alerts (external_id);

"""
Supabase client access
 QUERY
 create table public."Sensor" (
  id uuid not null default gen_random_uuid (),
  time timestamp without time zone not null,
  temperature_c double precision not null,
  humidity_pct double precision not null,
  distance_mm double precision not null,
  tilt_deg double precision not null,
  constraint Sensor_pkey primary key (id)
) TABLESPACE pg_default;
"""
-- Create VIP passes table
create table if not exists vip_passes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  active boolean not null default true,
  expires_at timestamptz
);

-- Create waitlist table
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text,
  email text not null,
  instagram text,
  ref_code text
);

-- Insert sample VIP codes
insert into vip_passes (code, active, expires_at) values
  ('1234', true, now() + interval '30 days'),
  ('CABANA', true, now() + interval '60 days'),
  ('VIPACCESS', true, now() + interval '90 days')
on conflict (code) do nothing;
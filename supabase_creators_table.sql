create table if not exists creators(
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null,
  handle text unique not null,
  display_name text, 
  bio text, 
  avatar_url text,
  theme jsonb default '{"preset":"glass","accent":"#8b5cf6","font":"system","bg":"default"}'::jsonb,
  links jsonb default '[]'::jsonb,
  video_url text, 
  products jsonb default '[]'::jsonb,
  tipjar_title text default 'Buy me a coffee', 
  tipjar_url text
);
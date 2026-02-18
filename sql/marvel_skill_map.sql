create table if not exists public.marvel_skill_map (
  english_name text primary key,
  korean_name text not null,
  key_label text,
  type text,
  source text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists marvel_skill_map_is_active_idx
  on public.marvel_skill_map (is_active);

-- galleries
create table galleries (
  id uuid primary key default gen_random_uuid(),
  studio_id text not null,
  slug text not null,
  couple_names text not null,
  wedding_date date not null,
  theme_message text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  view_count int not null default 0,
  comment_count int not null default 0,
  status text not null default 'active' check (status in ('active', 'expired')),
  unique (studio_id, slug)
);

create index idx_galleries_studio_slug on galleries (studio_id, slug);

-- photos
create table photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries (id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries (id) on delete cascade,
  guest_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table galleries enable row level security;
alter table photos enable row level security;
alter table comments enable row level security;

-- public read
create policy "public read galleries" on galleries for select using (true);
create policy "public read photos" on photos for select using (true);
create policy "public read comments" on comments for select using (true);

-- authenticated write restricted to matching studio_id
create policy "studio insert galleries" on galleries for insert
  to authenticated
  with check (studio_id = (select raw_user_meta_data->>'studio_id' from auth.users where id = auth.uid()));

create policy "studio update galleries" on galleries for update
  to authenticated
  using (studio_id = (select raw_user_meta_data->>'studio_id' from auth.users where id = auth.uid()));

create policy "studio delete galleries" on galleries for delete
  to authenticated
  using (studio_id = (select raw_user_meta_data->>'studio_id' from auth.users where id = auth.uid()));

create policy "studio insert photos" on photos for insert
  to authenticated
  with check (
    (select studio_id from galleries where id = gallery_id)
    = (select raw_user_meta_data->>'studio_id' from auth.users where id = auth.uid())
  );

create policy "studio delete photos" on photos for delete
  to authenticated
  using (
    (select studio_id from galleries where id = gallery_id)
    = (select raw_user_meta_data->>'studio_id' from auth.users where id = auth.uid())
  );

create policy "public insert comments" on comments for insert with check (true);

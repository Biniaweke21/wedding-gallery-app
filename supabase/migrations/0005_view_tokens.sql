create table view_tokens (
  token uuid primary key,
  created_at timestamptz default now()
);

alter table view_tokens enable row level security;

create policy "service role only" on view_tokens for all to service_role using (true);

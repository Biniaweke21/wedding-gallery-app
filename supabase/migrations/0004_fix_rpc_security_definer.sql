drop function if exists increment_view_count(uuid);
create or replace function increment_view_count(gallery_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update galleries set view_count = view_count + 1 where id = gallery_id;
$$;

drop function if exists increment_comment_count(uuid);
create or replace function increment_comment_count(gallery_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update galleries set comment_count = comment_count + 1 where id = gallery_id;
$$;

grant execute on function increment_view_count(uuid) to anon, authenticated;
grant execute on function increment_comment_count(uuid) to anon, authenticated;

-- galleries
drop policy if exists "studio insert galleries" on galleries;
drop policy if exists "studio update galleries" on galleries;
drop policy if exists "studio delete galleries" on galleries;

create policy "studio insert galleries" on galleries for insert
  to authenticated
  with check (studio_id = (auth.jwt() -> 'user_metadata' ->> 'studio_id'));

create policy "studio update galleries" on galleries for update
  to authenticated
  using (studio_id = (auth.jwt() -> 'user_metadata' ->> 'studio_id'));

create policy "studio delete galleries" on galleries for delete
  to authenticated
  using (studio_id = (auth.jwt() -> 'user_metadata' ->> 'studio_id'));

-- photos
drop policy if exists "studio insert photos" on photos;
drop policy if exists "studio delete photos" on photos;

create policy "studio insert photos" on photos for insert
  to authenticated
  with check (
    (select studio_id from galleries where id = gallery_id)
    = (auth.jwt() -> 'user_metadata' ->> 'studio_id')
  );

create policy "studio delete photos" on photos for delete
  to authenticated
  using (
    (select studio_id from galleries where id = gallery_id)
    = (auth.jwt() -> 'user_metadata' ->> 'studio_id')
  );

-- comments (no change to public insert, but add studio delete)
drop policy if exists "studio delete comments" on comments;

create policy "studio delete comments" on comments for delete
  to authenticated
  using (
    (select studio_id from galleries where id = gallery_id)
    = (auth.jwt() -> 'user_metadata' ->> 'studio_id')
  );

create or replace function increment_comment_count(gallery_id uuid)
returns void language sql as $$
  update galleries set comment_count = comment_count + 1 where id = gallery_id;
$$;

create or replace function increment_view_count(gallery_id uuid)
returns void language sql as $$
  update galleries set view_count = view_count + 1 where id = gallery_id;
$$;

-- 인증샷 여러 장 + 영상 지원
alter table reviews add column if not exists submission_id text;
alter table reviews add column if not exists media jsonb not null default '[]'::jsonb;
update reviews set submission_id = coalesce(submission_id, photo_path, id::text),
  media = case when photo_path is not null and media = '[]'::jsonb
               then jsonb_build_array(jsonb_build_object('path', photo_path, 'type', 'image')) else media end;
update storage.buckets set allowed_mime_types = array['image/*', 'video/*'], file_size_limit = 104857600 where id = 'reviews';

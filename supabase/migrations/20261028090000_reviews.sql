-- 체험 인증샷·소감 (VIP 초대권 받기 폼)
create table if not exists reviews (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  project_id text not null,
  child_name text not null,
  kids_count int not null check (kids_count between 1 and 20),
  comment text not null,
  photo_path text
);
alter table reviews enable row level security;
create policy "reviews anon insert" on reviews for insert to anon with check (true);
create policy "reviews anon select" on reviews for select to anon using (true);

-- 인증샷 사진 버킷 (10MB, 이미지만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reviews', 'reviews', true, 10485760, array['image/*'])
on conflict (id) do nothing;
create policy "reviews photo upload" on storage.objects for insert to anon with check (bucket_id = 'reviews');

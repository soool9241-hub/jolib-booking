-- 예약 유입경로 (당근, 메타, 포스터, 현장접수 등)
alter table public.bookings add column if not exists source text;

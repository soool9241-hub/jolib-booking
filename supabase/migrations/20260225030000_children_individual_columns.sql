-- children jsonb 컬럼을 개별 text 컬럼으로 변경
-- 각 컬럼: "이름/성별/나이" 형식 (예: "민수/남/7")

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children1 text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children2 text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children3 text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children4 text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children5 text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children6 text;

-- 기존 children jsonb 데이터를 개별 컬럼으로 마이그레이션
UPDATE bookings SET
  children1 = CASE WHEN children->0 IS NOT NULL THEN
    COALESCE(children->0->>'name','') || '/' || COALESCE(children->0->>'gender','') || '/' || COALESCE(children->0->>'age','')
  END,
  children2 = CASE WHEN children->1 IS NOT NULL THEN
    COALESCE(children->1->>'name','') || '/' || COALESCE(children->1->>'gender','') || '/' || COALESCE(children->1->>'age','')
  END,
  children3 = CASE WHEN children->2 IS NOT NULL THEN
    COALESCE(children->2->>'name','') || '/' || COALESCE(children->2->>'gender','') || '/' || COALESCE(children->2->>'age','')
  END,
  children4 = CASE WHEN children->3 IS NOT NULL THEN
    COALESCE(children->3->>'name','') || '/' || COALESCE(children->3->>'gender','') || '/' || COALESCE(children->3->>'age','')
  END,
  children5 = CASE WHEN children->4 IS NOT NULL THEN
    COALESCE(children->4->>'name','') || '/' || COALESCE(children->4->>'gender','') || '/' || COALESCE(children->4->>'age','')
  END,
  children6 = CASE WHEN children->5 IS NOT NULL THEN
    COALESCE(children->5->>'name','') || '/' || COALESCE(children->5->>'gender','') || '/' || COALESCE(children->5->>'age','')
  END
WHERE children IS NOT NULL AND children != '[]'::jsonb;

-- 기존 children jsonb 컬럼 삭제
ALTER TABLE bookings DROP COLUMN IF EXISTS children;

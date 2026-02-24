ALTER TABLE bookings ADD COLUMN IF NOT EXISTS children jsonb DEFAULT '[]'::jsonb;

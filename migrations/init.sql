-- migrations/init.sql
-- Create seats and bookings

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;

CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  seat_number INTEGER UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available', -- 'available' | 'booked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  seat_id INTEGER NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample seats (e.g., 1..20)
INSERT INTO seats (seat_number) SELECT generate_series(1, 20);

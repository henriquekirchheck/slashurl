-- Your SQL goes here
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  short_url varchar(8) UNIQUE NOT NULL,
  full_url varchar(2048) NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
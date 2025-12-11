# Modex — Medication Interaction Checker (Backend)

This backend service provides a simple, extensible medication interaction checker.
Given a list of medications, it returns interaction severity, explanations, and alternatives.
Note: Demo dataset only. Not medical advice.

## Tech Stack
- Node.js + Express
- PostgreSQL
- pg (Postgres client)
- dotenv
- CORS API design

## Why this project?
Medication safety is a major healthcare challenge.
This project demonstrates:
- clean backend structure
- healthcare-focused reasoning
- extensible interaction model
- predictable API design

## Quickstart (macOS)

1. Install dependencies:
   npm install

2. Start Postgres (Docker):
   docker run --name modex-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_DB=modex \
     -p 5432:5432 \
     -d postgres:15

3. Run DB migration:
   psql -h localhost -U postgres -d modex -f migrations/meds_init.sql

4. Start server:
   npm run dev

Server runs at: http://localhost:4000

## API Endpoints

GET /meds
    → List medications

GET /meds/:id
    → Fetch one medication

POST /check-interactions
Body example:
{
  "meds": ["Warfarin", "Aspirin"]
}

## Example

curl -s -X POST http://localhost:4000/check-interactions \
  -H "Content-Type: application/json" \
  -d '{"meds":["Warfarin","Aspirin"]}' | jq .

## Project Structure

/migrations      -- SQL tables + medication dataset
/src             -- server code (app.js, db.js)
README.md        -- documentation

## Notes
- Demo dataset only.
- Severity levels:
  1 = Low
  2 = Moderate
  3 = Severe

## Frontend

The frontend is in `/frontend`. To run locally:

1. cd frontend
2. npm install
3. npm run dev

Set `VITE_API_BASE` (defaults to `http://localhost:4000`) in `.env` if your backend runs on a different host.


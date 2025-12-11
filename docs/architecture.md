# Architecture Overview

This document summarizes the high-level architecture of the Medication Interaction Checker.

## Components

1. **Client (Frontend)** — React + TypeScript (separate repo or static site).
   - Fetches `GET /meds` for discovery.
   - Sends selected medication names to `POST /check-interactions`.
   - Displays `overall_severity`, per-pair explanations and `missing` names.

2. **Backend (This repo)**
   - Node.js + Express app (src/app.js)
   - Exposes:
     - `GET /meds`
     - `GET /meds/:id`
     - `POST /check-interactions`
   - Uses `pg` Pool to connect to Postgres (src/db.js)
   - CORS enabled for frontend interaction.

3. **Database**
   - PostgreSQL
   - Tables:
     - `medications` — canonical medication list
     - `med_interactions` — pairwise interaction rules (severity, explanation, alternatives)

4. **Optional**
   - Admin UI or CSV importer to expand dataset
   - CI pipeline to run unit tests
   - Docker + docker-compose for reproducible demo environment

---

## Simple ASCII diagram

Frontend (React)
      |
      |  HTTP (CORS)
      v
Backend (Express) ---> Postgres (medications, med_interactions)
     - app.js                - stores meds & pairwise rules
     - db.js (pg pool)
     - migrations/*.sql

Notes:
- Interaction checks are stateless and quickly resolved via SQL lookups.
- The backend normalizes names → maps to IDs → queries med_interactions for pairs.
- Overall severity is computed as the maximum severity among returned pairs.

---

## Deployment considerations
- Use environment variables for DB connection (dotenv).
- In production, run Postgres in a managed service (RDS / Cloud SQL) or Docker with persistent volumes.
- Add authentication (JWT/OAuth) if customer data or user accounts are added.
- Add logging, request rate-limiting, and monitoring (Prometheus / Grafana) for production readiness.


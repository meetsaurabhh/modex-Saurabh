# Medication Interaction Checker
The Medication Interaction Checker is a full-stack application designed to help users quickly identify potential interactions between commonly used medications. The project aims to make medication safety more accessible by providing a simple, intuitive interface where users can select drugs and instantly receive information about interactions, risks, and clinical explanations.

At its core, the system uses a Node.js + Express backend connected to a PostgreSQL database that stores medication details and known drug–drug interactions. The backend exposes secure REST APIs that power the application’s logic. A clean and modern React (Vite + TypeScript) frontend consumes these APIs, giving users a smooth experience with real-time interaction checks and descriptive guidance.

## What the Project Aims to Achieve

- Provide a fast and reliable tool for checking medication interactions.
- Make critical medical safety information easy to understand for non-technical users.
- Demonstrate strong full-stack development skills, including API design, database modeling, and frontend implementation.
- Showcase deployment of production-ready applications using:
- Render for backend hosting
- Vercel for frontend hosting
- Present clean, maintainable, and extensible code suitable for real-world scaling.

## How the Project Was Built

Database Design (PostgreSQL)

- Structured tables for medications and interactions.

- Seeded initial data using SQL migrations.

- Tested and verified using live SQL queries.

Backend (Node.js, Express, pg)

Built REST API endpoints for:
- Fetching the list of medications
- Checking interaction risks between user-selected drugs
- Implemented robust error handling and CORS.
Added secure environment variable configuration with DATABASE_URL + SSL for Render.

Frontend (React, Vite, TypeScript)
- Designed clean UI for selecting medications, checking interactions, and displaying results.
- Integrated axios to communicate with the backend API.
- Ensured responsiveness and usability.
- Fixed TypeScript + Vite build issues for production deployment.

Deployment
- Backend deployed to Render with secure configuration and automatic redeploys.
- Frontend deployed to Vercel using the frontend subdirectory.
- Verified cross-origin communication between both services.
- Validated live interaction checks using curl and UI tests.

---
LIVE LINKS
--------------------
Frontend (Vercel):
https://modexsaurabhfrontend.vercel.app

Backend (Render):
https://modex-saurabh.onrender.com

---
TECH STACK
--------------------
Backend:
- Node.js
- Express
- PostgreSQL
- pg (client)
- Hosted on Render

Frontend:
- React + TypeScript
- Vite
- Hosted on Vercel

---
PROJECT STRUCTURE
--------------------
```
modex-Saurabh/
├── frontend/        # React + Vite UI
├── src/             # Express backend
├── migrations/      # Database schema + seed
└── docs/            # Screenshots for README
```
---
DATABASE SCHEMA
--------------------
MEDICATIONS TABLE
id            integer (PK)
name          text
common_use    text
notes         text

MED_INTERACTIONS TABLE
med1_id       integer (FK)
med2_id       integer (FK)
severity      text
explanation   text
alternative   text

---
LOCAL SETUP
--------------------

1) Clone Repo
git clone https://github.com/meetsaurabhh/modex-Saurabh.git
cd modex-Saurabh

2) BACKEND SETUP
npm install

Create .env:
DATABASE_URL=<your-render-postgres-url>
PORT=4000
NODE_ENV=development

Start backend:
node src/app.js

Backend runs at:
http://localhost:4000

3) FRONTEND SETUP
cd frontend
npm install
npm run dev

Runs at:
http://localhost:5173

When deploying set:
VITE_API_BASE=https://modex-saurabh.onrender.com

---
API DOCUMENTATION
--------------------

GET /meds
Returns list of medications.

POST /check-interactions
Body:
{
  "meds": ["Warfarin", "Aspirin"]
}

Returns:
{
  "success": true,
  "interactions": [...]
}

---
DEPLOYMENT
--------------------

Backend — Render
- Autodeploy from GitHub
- DATABASE_URL required
- SSL enabled
- URL: https://modex-saurabh.onrender.com

Frontend — Vercel
- Root directory: frontend/
- Build command: npm run build
- Output directory: dist
- Env var:
  VITE_API_BASE=https://modex-saurabh.onrender.com

```mermaid
flowchart TB
  %% Nodes
  A[Users<br/>(Browser / Mobile)] -->|HTTP(S)| B[Frontend<br/>(Vercel)"]
  B --> |REST API (JSON)| C[Backend API<br/>(Express on Render)]
  C --> |SQL (pg) / SSL| D[(Postgres DB<br/>(Render Managed))]
  G[GitHub Repository<br/>(meetsaurabhh/modex-Saurabh)] -.-> |Push / PR| E(Vercel - Frontend)
  G -.-> |Push / PR| F(Render - Backend)
  E --> |Auto Deploy| B
  F --> |Auto Deploy| C

  subgraph Migrations
    M1["migrations/meds_init.sql"]
    M2["psql / Render SQL editor"]
  end
  M1 --> M2
  M2 --> D

  subgraph Env
    EV1["Vercel: VITE_API_BASE"]
    EV2["Render: DATABASE_URL"]
  end
  EV1 --> B
  EV2 --> C

  style A fill:#f9f,stroke:#333,stroke-width:1px
  style B fill:#61dafb,stroke:#333,stroke-width:1px
  style C fill:#9ad3bc,stroke:#333,stroke-width:1px
  style D fill:#336791,stroke:#fff,stroke-width:1px
  style G fill:#24292f,stroke:#fff,stroke-width:1px
  style Migrations fill:#fff8c6,stroke:#b58900,stroke-width:1px
  style Env fill:#f0f0f0,stroke:#999,stroke-width:1px

  %% Notes
  classDef small font-size:12px;
  note1((Note)):::small
  note1 ---|"CORS enabled, SSL required for DB"| C
```

---
STATUS
--------------------
- Backend API:         DONE
- Database Setup:      DONE
- Frontend UI:         DONE
- Interaction Logic:   DONE
- Deployment:          LIVE

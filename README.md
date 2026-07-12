# 🌍 EcoSphere — ESG Management Platform

> **BlackMatter** · A full-stack Environmental, Social & Governance (ESG) management platform that unifies sustainability metrics, employee engagement, and compliance tracking into a single real-time dashboard.

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

---

## 📖 Overview

Organizations are increasingly expected to monitor carbon emissions, promote employee well-being, and maintain governance compliance — yet ESG reporting is often manual, disconnected, and impossible to monitor in real time.

**EcoSphere** solves this by integrating ESG directly into day-to-day operations: measuring sustainability metrics, encouraging employee participation through gamification, and surfacing everything in a unified management dashboard.

---

## ✨ Features

| Pillar | Capabilities |
|--------|-------------|
| 🌱 **Environmental** | Carbon accounting, emission factors, sustainability goals, carbon transaction tracking |
| 🤝 **Social** | CSR activities, employee participation, approval workflows, diversity metrics |
| ⚖️ **Governance** | ESG policies, policy acknowledgements, audits, compliance issue tracking |
| 🏆 **Gamification** | Challenges, XP, badges, rewards, leaderboards |
| 📊 **Dashboard** | Real-time ESG scoring, emissions trends, department rankings, CSR allocation |
| 📑 **Reports** | Environmental / Social / Governance / ESG Summary reports + custom report builder |
| 🔐 **Auth** | JWT-based authentication with signup & login |

---

## 🏗️ Architecture

```
┌─────────────────┐        HTTP /api/*         ┌──────────────────┐        ┌──────────────┐
│                 │  ──────────────────────▶   │                  │        │              │
│  React + Vite   │      (Vite dev proxy)      │  FastAPI (async) │  ───▶  │  PostgreSQL  │
│   (port 3000)   │   ◀──────────────────────  │   (port 8000)    │        │  (port 5432) │
│                 │        JSON responses       │                  │        │              │
└─────────────────┘                            └──────────────────┘        └──────────────┘
     Frontend                                        Backend                   Database
```

The frontend issues same-origin `/api/*` requests, which Vite proxies to the FastAPI backend. The backend serves domain routers plus a dedicated **adapter layer** that shapes responses to the frontend's contract, all backed by an async SQLAlchemy connection to PostgreSQL.

---

## 🗂️ Project Structure

```
BlackMatter/
├── backend/
│   ├── api/                 # Route handlers (thin controllers)
│   │   ├── auth.py          #   JWT signup / login
│   │   ├── frontend.py      #   Adapter layer — frontend-shaped endpoints
│   │   ├── environmental.py │
│   │   ├── governance.py    │  Domain routers
│   │   ├── social.py        │
│   │   ├── gamification.py  │
│   │   └── shared.py        #   Departments / Users / Categories
│   ├── core/                # Config, DB engine, enums, security (JWT/bcrypt)
│   ├── models/              # SQLAlchemy 2.0 ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── services/            # Business logic layer
│   ├── seed_data.py         # Idempotent database seeder
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Dashboard, Environmental, Social, Governance, etc.
│   │   ├── hooks/           # Data-fetching hooks (one per domain)
│   │   ├── lib/api.ts       # API client with JWT injection
│   │   ├── App.tsx          # Shell + auth gate + routing
│   │   └── main.tsx
│   ├── vite.config.ts       # Dev server + /api proxy to backend
│   └── package.json
├── docker-compose.yml       # Orchestrates db + api services
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+ and npm

### 1 · Start the backend + database

```bash
docker compose up --build -d
docker compose exec api python seed_data.py
```

The API is now live at **http://localhost:8000** — interactive docs at **http://localhost:8000/docs**.

### 2 · Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is now live at **http://localhost:3000**.

### 3 · Log in

Open **http://localhost:3000** and sign in with a seeded account:

| Email | Password |
|-------|----------|
| `asha@ecosphere.test` | `password123` |
| `rahul@ecosphere.test` | `password123` |
| `divya@ecosphere.test` | `password123` |
| `arjun@ecosphere.test` | `password123` |

Or click **Sign up** to register a new account (persisted to PostgreSQL with a hashed password).

---

## 🔌 API Reference

Base URL: `http://localhost:8000/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user, returns JWT |
| `POST` | `/auth/login` | Authenticate (OAuth2 form), returns JWT |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/dashboard/metrics` | Overall score, emissions trend, top departments, CSR allocation |
| `POST` | `/dashboard/log-carbon` | Quick-log a carbon amount |

### Environmental
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/environmental/goals` | List sustainability goals |
| `POST` | `/environmental/goals` | Create a goal |
| `DELETE` | `/environmental/goals/{id}` | Delete a goal |

### Social
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/social/activities` | List CSR activities |
| `POST` | `/social/activities/{id}/join` | Join an activity |
| `GET`  | `/social/approvals` | List participation approvals |
| `POST` | `/social/approvals/{id}/action` | Approve / reject a participation |

### Governance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/governance/departments` | List departments |
| `POST` | `/governance/departments` | Create a department |

### Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/gamification/challenges` | List challenges |
| `POST` | `/gamification/challenges/{id}/join` | Join a challenge |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/reports/templates` | List report templates |
| `POST` | `/reports/custom` | Generate a custom report |

> Full domain endpoints (emission factors, carbon transactions, policies, audits, compliance issues, badges, rewards) are documented in the live Swagger UI at `/docs`.

---

## 🛠️ Tech Stack

**Backend**
- FastAPI (async) · SQLAlchemy 2.0 (async ORM) · asyncpg
- PostgreSQL 15
- Pydantic v2 · PyJWT · passlib/bcrypt

**Frontend**
- React 19 · TypeScript · Vite 6
- Tailwind CSS 4 · lucide-react · motion

**Infrastructure**
- Docker & Docker Compose
- `uv` for fast Python dependency installation

---

## 🗄️ Database

The schema is created automatically on backend startup via SQLAlchemy `create_all`. To (re)seed:

```bash
docker compose exec api python seed_data.py
```

To inspect data directly:

```bash
docker compose exec db psql -U ecosphere -d ecosphere -c "SELECT * FROM environmental_goals;"
```

To reset the database completely:

```bash
docker compose down -v && docker compose up --build -d
docker compose exec api python seed_data.py
```

---

## 🧑‍💻 Development Notes

- **CORS** is open (`*`) for local development — restrict before production.
- **Model changes** during development: since migrations aren't used, drop the volume (`docker compose down -v`) and restart to recreate tables.
- **Switching DB**: the backend reads `DATABASE_URL` from the environment; defaults to the Dockerized Postgres.

---

## 👥 Team

Built for the Odoo Hackathon by the **BlackMatter** team.

- **Backend** — API architecture, database models, business logic, integration
- **Frontend** — React UI, component design, data hooks

---

## 📄 License

This project was developed for a hackathon. All rights reserved by the BlackMatter team.

# EcoSphere Backend

FastAPI + SQLAlchemy backend for the ESG Management Platform. This is the
exoskeleton — folder structure, DB models, schemas, and wired-but-stubbed
routes — built so two backend devs can work in separate files with zero
merge conflicts, and land on a working Swagger contract from hour one.

## Quickstart

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # defaults to SQLite, no edits needed to start

python seed.py                    # optional: creates 2 departments, 3 employees, 4 categories
uvicorn main:app --reload
```

Swagger UI: **http://localhost:8000/docs** — this is your API contract.
Give this link to the frontend team immediately, before the real business
logic is done. Every endpoint below already works against the DB except
the ones explicitly marked TODO.

## Who owns what

| Person | Files |
|---|---|
| **Dev 1** — Environmental + Governance | `models/environmental.py`, `models/governance.py`, `schemas/environmental.py`, `schemas/governance.py`, `api/environmental.py`, `api/governance.py`, `services/environmental_service.py`, `services/governance_service.py` |
| **Dev 2** — Social + Gamification | `models/social.py`, `models/gamification.py`, `schemas/social.py`, `schemas/gamification.py`, `api/social.py`, `api/gamification.py`, `services/social_service.py`, `services/gamification_service.py` |
| **Shared** (build together, or whoever's free first) | `models/shared.py`, `models/scoring.py`, `models/settings.py`, `api/shared.py`, `api/scoring.py`, `api/settings.py`, `api/notifications.py`, `api/reports.py`, `services/scoring_service.py`, `services/notification_service.py`, `services/report_service.py`, everything in `core/` |

**Build order that avoids blocking each other:**
1. Shared layer first (`core/`, `models/shared.py`, `api/shared.py`) — already done in this skeleton.
2. Dev 1 and Dev 2 build their domains in parallel — models → schemas → services → api, in that order, since each layer imports the one before it.
3. Scoring, Reports, and Notifications last, once there's real data in the domain tables to work with.

## What's already working vs. what's a stub

Every **model, schema, and CRUD endpoint** (create/list/get) is real and
tested — I ran an end-to-end smoke test through the actual DB (department
→ employee → emission factor → carbon transaction → compliance issue
overdue flagging → challenge status lifecycle) before handing this off.
34 endpoints are registered and respond correctly.

What's deliberately left as a `NotImplementedError` stub, each with a
docstring explaining exactly what to build, are the pieces of *business
logic* the brief calls out as the hard part:

- `services/environmental_service.py` — Auto Emission Calculation from ERP records, department carbon totals
- `services/governance_service.py` — overdue compliance issue querying (the per-issue flag itself already works)
- `services/social_service.py` — CSR participation approval (evidence check, points award)
- `services/gamification_service.py` — XP award, Badge Auto-Award rule evaluation, Reward Redemption (stock + balance checks)
- `services/scoring_service.py` — Department/Overall ESG score calculation
- `services/notification_service.py` — the four required notification triggers
- `services/report_service.py` — the four standard reports + Custom Report Builder, PDF/Excel/CSV export

Calling any of these routes right now returns a clean 500 from the
`raise NotImplementedError` — that's expected, it means the wiring is
correct and you just need to fill in the function body.

## Business rules to keep in mind while building (Section 8 of the brief)

- **Compliance Issue** must always have an owner + due date — already enforced as required fields in `ComplianceIssueCreate`.
- **Evidence Requirement**, **Auto Emission Calculation**, and **Badge Auto-Award** are all settings-gated — check `ESGConfig` (via `GET /api/settings/esg-config`) before running that logic, don't hardcode it on.
- **Reward Redemption** must check stock and points balance atomically — do the check and the decrement in the same DB transaction so two people can't race-redeem the last item.
- Notifications fire on exactly four events: compliance issue raised, CSR/Challenge approval decisions, policy acknowledgement reminders, badge unlocks. Call `services.notification_service.notify()` from inside the relevant domain service, not from the route handler.

## Anti-conflict rules (from your doc, restated so they don't get lost)

- **Branch per feature, not per person**: `feat/carbon-calculator`, `feat/badge-system` — not `backend-1`/`backend-2`.
- **CORS is wide open** (`allow_origins=["*"]`) for the hackathon — don't touch `main.py`'s CORS config.
- **Swagger is the contract** — if you need to change a response shape, update the schema first and tell the frontend team, don't silently change what an endpoint returns.

## Switching to Postgres

Change `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/ecosphere
```
Uncomment `psycopg2-binary` in `requirements.txt` and reinstall. Nothing
else changes — SQLAlchemy handles the dialect difference.

## Notes / things I made a judgment call on

- **No Alembic.** Tables are created with `Base.metadata.create_all()` on
  startup for hackathon speed. If you change a model's columns after
  tables already exist, delete `ecosphere.db` and restart rather than
  fighting SQLite's limited `ALTER TABLE` support.
- **No auth.** `Employee.role` exists (`employee`/`manager`/`admin`) but
  nothing enforces it yet. Fine for a hackathon demo; flag it if the judges care.
- **DiversityMetric and TrainingRecord** (in `models/social.py`) aren't in
  the brief's data model table — it lists "Diversity Metrics" and
  "Training Completion" as features without a schema, so I added a
  reasonable starting shape. Adjust freely.

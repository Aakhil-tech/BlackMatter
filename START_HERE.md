# BlackMatter — IT WORKS. Here's how to run it.

Tested end-to-end: browser → Vite proxy (:3000) → FastAPI (:8000) → DB.
All reads AND writes confirmed working through the proxy, including login.

## Run — TWO terminals

### Terminal 1 — Backend
```
cd BlackMatter
docker compose up --build -d
docker compose exec api python seed_data.py
```
Wait until you see the seed summary. Backend is now at http://localhost:8000

### Terminal 2 — Frontend
```
cd BlackMatter/frontend
npm install
npm run dev
```
Frontend is now at http://localhost:3000

## OPEN http://localhost:3000

You'll see real data:
- Departments: Operations, Logistics, Corporate, Facilities
- A CSR activity "Tree Plantation Drive"
- A challenge "Zero Waste Week"

If you see "Renewable Energy Operations" / "Water Stewardship" instead,
you're on the OLD MOCK — you ran `npm run dev:mock` by mistake.
Use `npm run dev`.

## Login (demo)
Email: asha@ecosphere.test
Password: password123

## Confirmed working (tested through the proxy):
- GET  departments, goals, activities, approvals, challenges, reports, dashboard
- POST create goal (201)
- POST join challenge (200)
- POST approve participation (200, awards points)
- POST login (200, returns JWT)

## If a tab is blank / spinning
1. Is the backend up?  ->  curl http://localhost:8000/health
2. Did you seed?       ->  docker compose exec api python seed_data.py
3. Are you on dev not dev:mock?  ->  check terminal 2 shows "VITE ready"
4. Open browser DevTools (F12) -> Network tab -> look for red /api calls.
   Paste any red error and it's a 2-minute fix.

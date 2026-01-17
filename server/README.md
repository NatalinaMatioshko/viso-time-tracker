# Server (API) — Viso Mini Time Tracker

Express + TypeScript REST API for storing and retrieving time entries.

## Tech stack

- Express (REST)
- TypeScript (ESM)
- Prisma ORM
- SQLite (via Prisma better-sqlite3 adapter)

## What is implemented

- `GET /api/health` — health-check.
- `GET /api/entries` — returns all time entries ordered by date/creation time.
- `POST /api/entries` — creates a time entry with validation.

### Validation rules

- All fields are required: `date`, `project`, `hours`, `description`.
- `hours` must be a positive number.
- Max 24 hours per calendar date: server sums existing hours for the given `date` and rejects requests that would exceed 24 hours.

## Project structure

- `src/index.ts` — Express app bootstrap, middleware, routes.
- `src/routes/entries.ts` — entries router (GET/POST).
- `src/db/prisma.ts` — Prisma client initialization.
- `prisma/schema.prisma` — `TimeEntry` model.

## Environment variables

Create `server/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

## How to run (development)

```bash
cd server
npm install
npx prisma migrate dev --name init --config prisma.config.ts
npm run dev
```

API will be available at `http://localhost:4000`.

## API examples

### Create entry

```bash
curl -X POST http://localhost:4000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-01-17","project":"Viso Internal","hours":2.5,"description":"Fix UI"}'
```

### Get entries

```bash
curl http://localhost:4000/api/entries
```

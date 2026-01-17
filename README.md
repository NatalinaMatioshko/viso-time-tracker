# Viso Mini Time Tracker

Mini time tracking app built as a Viso Academy test task: create time entries and view entry history grouped by date.

## Tech stack

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript (REST API)
- Database: SQLite
- ORM: Prisma

Project structure:

- `client/` — React app (UI + API calls)
- `server/` — Express API + Prisma + SQLite

## Features

- Create a time entry (date, project, hours, description)
- Entry history grouped by date
- Daily total and grand total hours
- Validation:
  - All fields are required
  - Hours must be a positive number
  - Max 24 hours per calendar date (enforced on backend)

## Prerequisites

- Node.js 18+ (recommended)
- npm

## How to run locally

### 1) Clone repository

```bash
git clone https://github.com/NatalinaMatioshko/viso-time-tracker.git
cd viso-time-tracker
```

### 2) Backend (server)

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

Run Prisma migrations (creates/updates SQLite DB):

```bash
npx prisma migrate dev --name init --config prisma.config.ts
```

Start dev server:

```bash
npm run dev
```

API will be available at `http://localhost:4000`.

Useful endpoints:

- `GET /api/health`
- `GET /api/entries`
- `POST /api/entries`

### 3) Frontend (client)

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`).

> Note: client expects API at `http://localhost:4000`.

## Notes

- Projects list is hardcoded in `client/src/projects.ts`.
- Backend enforces the “max 24 hours per day” rule.

## Links

- Repo: https://github.com/NatalinaMatioshko/viso-time-tracker
- Client docs: `client/README.md`
- Server docs: `server/README.md`

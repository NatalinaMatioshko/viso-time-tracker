# Client (UI) — Viso Mini Time Tracker

React + TypeScript UI for creating time entries and viewing history grouped by date.

## Tech stack

- React + TypeScript
- Vite
- Native `fetch` for API requests

## What is implemented

### Time Entry Form

- Date picker (default = today).
- Project dropdown (hardcoded list).
- Hours input (supports decimals, step 0.25).
- Work description textarea.
- Save button with “Saving…” state.

### Entry History

- Loads entries from API and renders them grouped by date.
- Table view per day: Project | Hours | Description.
- Shows total hours per day and grand total across all entries.

### UX / error handling

- Loading state while data is fetched.
- Inline error message if API fails or validation fails.

## Project structure

- `src/App.tsx` — main page (form + history + totals).
- `src/api.ts` — API client (`getEntries`, `createEntry`).
- `src/projects.ts` — hardcoded projects list.
- `src/utils.ts` — helper functions (grouping, sums, today).

## Configuration

Client expects API at `http://localhost:4000` (see `src/api.ts`).

## How to run (development)

Make sure server is running first.

```bash
cd client
npm install
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`).

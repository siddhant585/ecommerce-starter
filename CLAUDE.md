# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo with two services:
- `frontend/` — Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- `backend/` — FastAPI + Python 3.9 + PostgreSQL (psycopg2)

## Commands

### Frontend (`frontend/`)
```
pnpm run dev
pnpm run build
pnpm run lint
```

### Backend (`backend/`)
```
source .venv/bin/activate
uvicorn main:app --reload    # Start dev server
```

## Critical: Next.js 16

This project uses **Next.js 16**, which has breaking changes from earlier versions. APIs, conventions, and file structure differ from training data. **Before writing any Next.js code, read the relevant guide in `frontend/node_modules/next/dist/docs/`.**

Notable docs paths:
- `node_modules/next/dist/docs/01-app/` — App Router
- `node_modules/next/dist/docs/02-pages/` — Pages Router
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx` — required reading if fixing slow client-side navigations (`unstable_instant` export needed, Suspense alone is not sufficient)

The project uses the **App Router** (`frontend/app/`).

## Tailwind CSS v4

Uses Tailwind v4, which has a different configuration model than v3. CSS is imported with `@import "tailwindcss"` (no `@tailwind` directives). Theme customization uses `@theme inline {}` blocks in CSS rather than `tailwind.config.js`.

## Backend

FastAPI with Pydantic v2 for validation, psycopg2 for PostgreSQL, python-dotenv for env config. The `.venv` is at `backend/.venv`.

## Purpose
Onboarding project — I am writing all code myself. 
Claude is for planning, architecture questions, and debugging only.

## Current Phase
[ ] SQL migration files
[ ] DB connection in FastAPI
[ ] Products CRUD endpoints
[ ] Sessions + cart endpoints
[ ] Frontend product grid
[ ] Cart drawer
[ ] Checkout with concurrency handling

## Key Decisions
- Prices stored as integer cents
- Server-side sessions (no JWT)
- Plain SQL migrations, no ORM or Alembic

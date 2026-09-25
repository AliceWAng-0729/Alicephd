# PhD Navigator

Evidence-backed PhD discovery and application workspace.

## MVP
- Generic user profile flow (CV upload can be connected to OpenAI on the API layer)
- Program discovery and filtering UI
- Program detail with research fit, faculty fit, funding, deadline, requirements
- Shortlist / application tracker shell
- Provenance-first data model ready for official university sources + OpenAlex

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Environment
Copy `.env.example` to `.env.local` and add keys as needed. Do not commit secrets.

## Production architecture
Frontend: Next.js
Data/API: FastAPI or Next Route Handlers
DB: PostgreSQL / Supabase
Academic sources: OpenAlex, Crossref, ORCID
Primary facts: official university pages
AI: OpenAI Responses API with structured outputs
Crawler: httpx + trafilatura, Playwright fallback

## Important data principle
LLM output is interpretive. Deadlines, funding, requirements, application URLs, and faculty affiliation should be stored with source URL, retrieved timestamp, evidence text, and verification state. Never invent funded-position counts or deadlines.

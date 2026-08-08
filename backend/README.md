# AI Interview Backend (Phase 2A)

Purpose: provide a minimal HTTP backend foundation for the existing frontend. This Phase 2A scaffold implements in-memory session storage, validation, centralized error handling, CORS, and the core API routes. It does NOT implement AI/LLM logic or persistent storage.

Setup

- Copy `.env.example` to `.env` and adjust values if needed.
- Install dependencies (optional, not performed by Phase 2A automation):

```bash
cd backend
npm install
```

Run (development with ts-node):

```bash
cd backend
npm run dev
```

Build and run (production):

```bash
cd backend
npm run build
npm start
```

API Endpoints (Phase 2A)

- GET `/api/health` — health check
- POST `/api/interview` — start interview (sessionId empty or missing) or submit answer (sessionId present)
- GET `/api/interview/:sessionId/feedback` — retrieve feedback; returns FEEDBACK_NOT_READY when feedback is not available

Notes & Limitations

- This phase intentionally does NOT implement AI/LLM interview generation.
- Sessions are stored in memory and will be lost when the server restarts.
- Do not expose any secrets in `.env.example`.

Next (Phase 2B) responsibilities

- Implement LLM orchestration and question generation
- Integrate curriculum and candidate personalization
- Persist sessions to a database
- Implement evaluation and feedback generation

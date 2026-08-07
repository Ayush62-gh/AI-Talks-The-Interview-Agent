# AI Interview Agent

A modern React + Vite frontend for an AI interview agent. The UI is fully API-ready and uses a mock backend service until your real FastAPI backend is available.

## Features
- Landing page with hero section
- Interview chat page with AI and candidate messages
- Interview complete page with dynamic feedback
- Mock API in `src/services/api.ts`
- Dark glassmorphism theme with responsive design
- Subtle animations using Framer Motion
- Tailwind CSS styling

## Project Structure
- `src/components/` — reusable UI components
- `src/pages/` — page-level views
- `src/hooks/` — interview session state management
- `src/services/` — API layer
- `src/types/` — TypeScript interfaces
- `src/utils/` — utility modules (if needed)

## API Integration
Replace the mock API in `src/services/api.ts` with real HTTP calls to your backend.

Example API signatures:
- `startInterview(candidate)` → `POST /api/interview`
- `sendMessage(sessionId, message)` → `POST /api/interview`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Notes
- Interview logic is not hardcoded in UI.
- Chat updates depend on API responses.
- `services/api.ts` is the only file that needs replacement for a real backend.

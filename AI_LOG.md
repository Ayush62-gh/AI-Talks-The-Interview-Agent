# AI Activity Log

Date: 2026-08-08

Purpose: Record AI assistant actions while improving the interview frontend, and provide a corrected/rectified version of the user's request suitable for committing to the repository.

---

## Rectified user request

Original (raw):
> i want a ai log for this,rectify my messages and create it so that i push it directly in my github

Rectified (clean):
> Please create an AI activity log for this project. Correct and rephrase my messages where needed and add the log file so I can commit and push it directly to GitHub.

---

## Summary of work performed

- Implemented real session creation and persistence:
	- Added `createInterviewSession()` with a `generateSessionId()` that produces IDs like `INT-2026-A8X92K`.
	- Session objects persist to `localStorage` under `aiInterviewFullSession` and include session metadata, questions, answers, index, and timestamps.
- Interview state management:
	- `InterviewContext` was extended to store `sessionData` (`InterviewFullSession`), update answers, and advance the current question index.
	- `startInterview(config)` now builds and persists a full session, sets `sessionId`, initializes first question, and seeds the chat messages.
	- `submitAnswer(answer)` appends candidate messages, stores answers in the session, advances the index, and calls the existing `api.submitAnswer` for the next question or completion.
- Progress UI:
	- Added reusable `ProgressBar` component at `src/components/ProgressBar.tsx`.
	- `InterviewPage` displays `Question X / Y` and a dynamic progress bar.
- Feedback structure and service:
	- Added `getInterviewFeedback(sessionId)` placeholder in `src/services/feedbackService.ts` that returns the structured `InterviewFeedback` shape.
	- `CompletePage` renders structured feedback and fetches placeholder feedback if none provided.
- Theme toggle:
	- Added `useTheme` hook at `src/hooks/useTheme.ts` and `ThemeToggle` component at `src/components/ThemeToggle.tsx`.
	- `ThemeToggle` is integrated into the app layout (`src/App.tsx`) and persists the user's preference to `localStorage`.
- LLM-ready architecture:
	- Interview flow and feedback are separated into services (`session.ts`, `feedbackService.ts`) so LLM/back-end integration can replace internal logic later without changing UI components.

---

## Files added

- `src/services/session.ts` — create/load/save full interview sessions and generate session IDs
- `src/services/feedbackService.ts` — placeholder feedback API returning structured shape
- `src/components/ProgressBar.tsx` — reusable progress bar component
- `src/components/ThemeToggle.tsx` — theme switch UI component
- `src/hooks/useTheme.ts` — theme management hook

## Files modified (high level)

- `src/context/InterviewContext.tsx` — wired session creation, persistence, and submitAnswer to update `sessionData`
- `src/services/api.ts` — adapted mock API to new contract (kept lightweight)
- `src/pages/InterviewPage.tsx` — shows session ID, uses `ProgressBar`, uses `submitAnswer`
- `src/pages/CompletePage.tsx` — loads structured feedback placeholder when needed
- `src/App.tsx` — added `ThemeToggle` to the layout
- `src/types/interview.ts` — added `InterviewFullSession` and `SessionQuestion` types

---

## How session ID generation works

- `generateSessionId()` builds an ID as `INT-<YEAR>-<TOKEN>`, where `<TOKEN>` is a random 6-character uppercase alphanumeric string.
- IDs are unique per created session (collision risk is negligible for this usage level).

## How interview state is stored

- Full session is stored as JSON in `localStorage` under `aiInterviewFullSession`.
- `InterviewContext` also persists UI state (messages, current question, progress) into the existing app storage key for recovery.

## How progress tracking works

- `ProgressBar` receives `currentQuestion` and `totalQuestions`.
- Percent computed as `Math.round((currentQuestion / totalQuestions) * 100)` and displayed in the UI.

## How feedback API can be connected later

- Replace the implementation inside `src/services/feedbackService.ts::getInterviewFeedback` to call your back-end or LLM endpoint and return the same `InterviewFeedback` shape.
- Optionally replace `src/services/api.ts::submitAnswer` to ask your LLM for next prompts/questions or answers evaluation.

---

## How theme switching was implemented

- `useTheme` reads/writes `aiInterviewTheme` to localStorage and toggles `dark`/`light` class on `document.documentElement`.
- `ThemeToggle` component toggles the mode.
- The toggle is added to the app layout in `src/App.tsx` (top-right). Tailwind-based classes in the app will react to the `dark`/`light` class — you can expand or adapt Tailwind config later for a full light theme if desired.

---

## How to commit and push

Run these commands from the project root:

```bash
git add AI_LOG.md
git add .
git commit -m "chore: add AI activity log and prepare LLM-ready session + feedback services"
git push origin <your-branch>
```

Replace `<your-branch>` with the branch you want to push to (e.g. `main` or `feature/ai-session`).

---

If you want, I can also create a PR body or prepare a branch/commit message variant. Tell me what you'd like next.

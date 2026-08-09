# 🚀 AI Interview Agent — Hackathon Presentation Guide

## 🏆 Project Overview
**AI Interview Agent** is an autonomous, AI-driven technical candidate interviewing platform. It acts as a **Senior HR & Technical Lead Interviewer**, dynamically conducting role-specific interviews, evaluating candidate responses for factual technical accuracy against web standards, and generating executive HR hiring scorecards.

---

## 🔥 Key Innovation Features

1. **Autonomous HR & Technical Lead AI Persona**
   - Conducts intentional, curriculum-driven technical interviews for **Frontend, Backend, Software Engineer, Full Stack, Data Scientist, Product Manager, DevOps**.
   - Evaluates answers using official web standards and authoritative reference criteria.

2. **Dynamic Context-Aware Questioning Engine**
   - Follow-up questions dynamically adapt based on candidate's previous response content and technical depth.
   - Automatically detects brief or incomplete answers and prompts candidates for deeper architectural reasoning.

3. **Factual Verification & Scoring Pipeline**
   - Evaluates 4 core hiring dimensions: **Correctness, Relevance, Technical Depth, Communication**.
   - Flags factual gaps, missing concepts, and verified strengths in real time.

4. **Executive Corporate HR Candidate Scorecard**
   - Generates formal hiring recommendations (**STRONG HIRE, HIRE, CONDITIONAL HIRE, NO HIRE**).
   - Produces structured score breakdowns, verified candidate competencies, and targeted study roadmaps.

5. **Desktop-Native UX**
   - Pinned answer input bar with smooth auto-scroll.
   - Glassmorphism dark/light mode dashboard designed for enterprise hiring teams.

---

## ⚡ Quick Start for Judges / Evaluators

### 1️⃣ Start the Application
Run the following command in your terminal from the repository root:
```bash
# Terminal 1: Launch Backend API Server (Port 4000)
npm run dev --prefix backend

# Terminal 2: Launch Frontend App
npm run dev
```

### 2️⃣ Access the Platform
Open **`http://localhost:4176`** (or your Vite terminal port) in your web browser.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, TypeScript, TailwindCSS, Framer Motion, Vite, Lucide/React-Icons.
- **Backend:** Node.js (ESM), Express.js, TypeScript, OpenAI GPT-4o Integration / Role-Based Dynamic AI Provider.
- **Storage:** Pure JS Repository Persistence with zero native C++ build tool dependencies.

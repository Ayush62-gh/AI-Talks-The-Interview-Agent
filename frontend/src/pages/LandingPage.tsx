import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaBars,
  FaBrain,
  FaChartLine,
  FaCode,
  FaComments,
  FaLayerGroup,
  FaLightbulb,
  FaPlay,
  FaRobot,
  FaRoute,
  FaServer,
  FaTimes,
  FaUsers,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Interview Roles', href: '#roles' },
  { label: 'About', href: '#about' },
];

const highlights = [
  {
    title: 'Multiple Roles',
    description: 'Practice for the role you are targeting with tailored prompts and interview context.',
    icon: FaUsers,
  },
  {
    title: 'Technical + Behavioral',
    description: 'Prepare for technical depth, behavioral discussion, and system thinking in one experience.',
    icon: FaCode,
  },
  {
    title: 'Personalized Sessions',
    description: 'Each interview is shaped by your selected role, experience level, and preferred format.',
    icon: FaLayerGroup,
  },
  {
    title: 'Detailed Feedback',
    description: 'Review your performance with structured insights that point to growth areas and strengths.',
    icon: FaChartLine,
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose your role',
    description: 'Select the position you are targeting, from software engineering to product leadership and data science.',
  },
  {
    number: '02',
    title: 'Start your interview',
    description: 'Configure experience level, interview type, and the number of questions for the session.',
  },
  {
    number: '03',
    title: 'Answer naturally',
    description: 'Work through the interview question by question in a polished, focused experience.',
  },
  {
    number: '04',
    title: 'Get your feedback',
    description: 'Review your strengths, weaknesses, and suggested next steps after the session completes.',
  },
];

const features = [
  {
    title: 'AI Interviewer',
    description: 'Practice with role-specific interview questions that mirror real hiring conversations.',
    icon: FaRobot,
  },
  {
    title: 'Personalized Interviews',
    description: 'Use your selected role and experience level to shape the session experience.',
    icon: FaBrain,
  },
  {
    title: 'Progress Tracking',
    description: 'Follow how far you have progressed through your current interview session.',
    icon: FaRoute,
  },
  {
    title: 'Detailed Feedback',
    description: 'Understand what you did well and where your interview story can improve.',
    icon: FaComments,
  },
  {
    title: 'Multiple Interview Modes',
    description: 'Practice technical, behavioral, and system design conversations with a consistent flow.',
    icon: FaServer,
  },
  {
    title: 'Interview Sessions',
    description: 'Keep each interview organized with its own session state and progress history.',
    icon: FaLightbulb,
  },
];

const roles = [
  {
    title: 'Software Engineer',
    description: 'Practice coding, collaboration, APIs, and software engineering fundamentals.',
    icon: FaCode,
  },
  {
    title: 'Frontend Developer',
    description: 'Work through JavaScript, React, UI architecture, and browser-focused interview prompts.',
    icon: FaRobot,
  },
  {
    title: 'Backend Developer',
    description: 'Explore APIs, databases, distributed systems, and backend problem-solving conversations.',
    icon: FaServer,
  },
  {
    title: 'Full Stack Developer',
    description: 'Prepare for high-level product thinking, frontend depth, and backend trade-offs.',
    icon: FaLayerGroup,
  },
  {
    title: 'Product Manager',
    description: 'Practice prioritization, product strategy, metrics, and behavior-based questions.',
    icon: FaUsers,
  },
  {
    title: 'Data Scientist',
    description: 'Prepare for statistics, experimentation, modeling, and case-based interview prompts.',
    icon: FaChartLine,
  },
  {
    title: 'DevOps Engineer',
    description: 'Practice reliability, CI/CD, containers, cloud systems, and operational reasoning.',
    icon: FaRoute,
  },
];

const modes = [
  { title: 'Technical Interview', description: 'Deepen your understanding of systems, coding, and engineering trade-offs.' },
  { title: 'Behavioral Interview', description: 'Sharpen your storytelling, teamwork, and leadership examples.' },
  { title: 'System Design Interview', description: 'Practice scalable architecture and design decision-making.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-transparent px-4 py-4 text-slate-900 transition-colors duration-300 sm:px-6 lg:px-8 dark:text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[33rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] blur-3xl" />

      <header className="w-full max-w-none rounded-[2rem] border border-slate-200/80 bg-white/85 px-8 py-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/40">
        <div className="flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3.5 text-base text-slate-950 dark:text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-md shadow-sky-500/25">
              <FaRobot className="h-6 w-6" />
            </span>
            <span className="text-xl lg:text-2xl font-bold tracking-tight">AI Interviewer</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm lg:text-base font-medium text-slate-700 md:flex dark:text-slate-200">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-sky-600 dark:hover:text-sky-300">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Button onClick={() => navigate('/setup')} className="gap-2.5 px-6 py-3 text-sm lg:text-base font-semibold shadow-md hover:scale-105 transition-transform">
              <FaPlay className="h-3.5 w-3.5" />
              Start Interview
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
            >
              {mobileMenuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-3 rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/90 md:hidden">
            <nav className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/setup');
                }}
                className="rounded-2xl bg-blue-600 px-3 py-2 text-left text-sm font-medium text-white"
              >
                Start Interview
              </button>
            </nav>
          </div>
        ) : null}
      </header>

      <section id="top" className="w-full max-w-none flex flex-col gap-10 px-4 py-12 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 sm:px-8 lg:px-12">
        <div className="flex-1 space-y-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-sky-300">
            <FaRobot className="h-4 w-4" />
            AI-POWERED INTERVIEW PREPARATION
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl dark:text-white leading-[1.1]">
            Practice Real Interviews.
            <span className="block bg-gradient-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Get Smarter Feedback.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-600 dark:text-slate-300">
            Practice role-specific interviews with an AI interviewer, answer realistic questions, and get detailed feedback on your performance.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-wrap gap-4 pt-2">
            <Button onClick={() => navigate('/setup')} className="gap-3 px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
              <FaPlay className="h-4 w-4" />
              Start Interview
            </Button>
            <a href="#how-it-works" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/90 px-7 py-4 text-base sm:text-lg font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800">
              See How It Works
            </a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="group relative w-full lg:w-[48%] overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-glass">
          
          <div className="border-b border-slate-200/70 px-6 py-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-sky-600 dark:text-sky-300">INTERVIEW PREVIEW</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">AI Technical Interview</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>DEMO PREVIEW</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>Candidate: AI Engineer</span>
              <span>Question 3 of 10</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-1.5 w-[30%] rounded-full bg-gradient-to-r from-sky-500 to-violet-500" />
            </div>
          </div>

          <div className="flex-1 space-y-3.5 p-5 min-h-[320px]">
            
            {/* Fixed Single AI Question Bubble */}
            <div className="max-w-[90%] break-words rounded-br-2xl rounded-tr-2xl rounded-bl-2xl border border-slate-700/80 bg-slate-900/95 p-4 text-slate-100 shadow-md">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                <span className="font-semibold text-slate-200">AI INTERVIEWER</span>
                <span>• Day 10</span>
                <span>• RAG & Hybrid Search</span>
                <span>• Medium</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-400">QUESTION</div>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed font-normal text-slate-100">
                How does Dense Retrieval (Embeddings) differ from Sparse Retrieval (BM25), and how does Hybrid Search combine them using RRF?
              </p>
            </div>

            {/* Fixed Single Candidate Answer Bubble */}
            <div className="max-w-[90%] break-words self-end ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl border border-sky-200/80 bg-sky-50/90 p-4 text-slate-900 shadow-sm dark:border-sky-500/20 dark:bg-sky-950/40 dark:text-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                <span className="font-semibold text-slate-900 dark:text-slate-100">YOU</span>
              </div>
              <p className="mt-2 text-sm sm:text-base leading-relaxed font-normal text-slate-900 dark:text-slate-100">
                Dense retrieval captures semantic intent using embeddings, while BM25 matches exact keywords. Hybrid Search fuses their rank scores using Reciprocal Rank Fusion (RRF).
              </p>
            </div>

          </div>

          <div className="border-t border-slate-200/70 bg-white/90 px-5 py-3.5 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/90">
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  readOnly
                  rows={2}
                  placeholder="Type your answer..."
                  className="min-h-[64px] w-full resize-none rounded-[1.2rem] border border-slate-200/70 bg-slate-50/90 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100 cursor-default"
                />
                <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-slate-400">
                  0 characters
                </div>
              </div>
              <Button disabled variant="secondary" className="gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold opacity-80 cursor-default">
                Send <FaArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

        </motion.div>
      </section>

      <section className="w-full max-w-none px-4 py-8 sm:py-12 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-700 dark:text-sky-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="w-full max-w-none px-4 py-16 sm:py-24 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="max-w-4xl space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">How it works</p>
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl lg:text-5xl dark:text-white tracking-tight">How your AI interview works</h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">Follow a simple flow that moves from role selection to session feedback without leaving the existing interview experience.</p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div key={step.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }} className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">{step.number}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="w-full max-w-none px-4 py-8 sm:py-16 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="max-w-4xl space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Features</p>
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl lg:text-5xl dark:text-white tracking-tight">Everything you need to prepare with confidence</h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-700 dark:text-sky-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="roles" className="w-full max-w-none px-4 py-16 sm:py-24 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="max-w-4xl space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Interview roles</p>
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl lg:text-5xl dark:text-white tracking-tight">Practice for the role you are targeting</h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.button key={role.title} type="button" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.04 }} onClick={() => navigate('/setup', { state: { selectedRole: role.title } })} className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-7 text-left shadow-sm transition hover:-translate-y-1.5 hover:border-sky-500 dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-700 dark:text-sky-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{role.title}</h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">{role.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="w-full max-w-none px-4 py-8 sm:py-12 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-r from-sky-600/15 via-violet-600/15 to-fuchsia-500/15 p-8 sm:p-12 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gradient-to-r dark:from-sky-500/15 dark:via-violet-500/15 dark:to-fuchsia-500/15">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Interview modes</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white tracking-tight">Practice the format that fits your next opportunity</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {modes.map((mode) => (
              <div key={mode.title} className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/80">
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{mode.title}</h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">{mode.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="about" className="w-full max-w-none px-4 py-16 sm:py-24 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="rounded-[2.5rem] border border-slate-200/80 bg-white/85 p-8 sm:p-14 text-center shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Ready for your next interview?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 dark:text-white tracking-tight">Practice. Improve. Perform better.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">Use the existing interview setup flow to start a tailored preparation session and move directly into the interview experience.</p>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate('/setup')} className="gap-3 px-8 py-4 text-base sm:text-lg font-semibold shadow-xl hover:scale-105 transition-transform">
              <FaPlay className="h-4 w-4" />
              Start Your Interview
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="w-full max-w-none border-t border-slate-200/80 px-4 py-10 text-sm text-slate-600 sm:px-8 lg:px-12 dark:border-white/10 dark:text-slate-400">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-950 dark:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-md">
                <FaRobot className="h-5 w-5" />
              </span>
              AI Interviewer
            </div>
            <p className="text-sm leading-relaxed">AI-powered interview preparation built for modern teams and ambitious candidates.</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Product</h3>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li><a href="#features" className="transition hover:text-sky-600 dark:hover:text-sky-300">Features</a></li>
                <li><a href="#how-it-works" className="transition hover:text-sky-600 dark:hover:text-sky-300">How It Works</a></li>
                <li><a href="#roles" className="transition hover:text-sky-600 dark:hover:text-sky-300">Interview Roles</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Interview</h3>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li className="text-slate-600 dark:text-slate-400">Technical</li>
                <li className="text-slate-600 dark:text-slate-400">Behavioral</li>
                <li className="text-slate-600 dark:text-slate-400">System Design</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">© 2026 AI Interviewer</p>
      </footer>
    </main>
  );
}

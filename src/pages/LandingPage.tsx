import { motion } from 'framer-motion';
import { FaRobot, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-10 sm:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(67,56,202,0.25),_transparent_60%)] blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-2xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-3 rounded-full bg-slate-800/60 px-4 py-2 text-sm text-sky-200 shadow-xl shadow-slate-950/10 backdrop-blur-sm">
            <FaRobot className="h-4 w-4 text-sky-300" />
            AI Interview Platform for modern hires
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Build a personalized AI interview experience in minutes.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-xl text-lg leading-8 text-slate-300">
            Configure role, level, and interview scope, then answer AI-generated questions with a polished feedback report at the end.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Button onClick={() => navigate('/setup')} className="gap-3">
              <FaPlay className="h-4 w-4" />
              Start Interview Setup
            </Button>
          </motion.div>
        </section>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_30%)]" />
          <div className="relative space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/30">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-blue-300 ring-1 ring-slate-700">
                  <FaRobot className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Facilitator</p>
                  <h2 className="text-xl font-semibold text-white">Interview flow preview</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Real interview data will be streamed from a backend API. Responses, session state, and final feedback are all built to integrate with your AI backend.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Interview setup', 'AI chat interface', 'Progress tracking', 'Feedback report'].map((feature) => (
                <div key={feature} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300 shadow-lg shadow-slate-950/10">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

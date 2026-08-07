import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InterviewPage from './pages/InterviewPage';
import InterviewSetup from './pages/InterviewSetup';
import CompletePage from './pages/CompletePage';
import { InterviewProvider } from './context/InterviewContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const location = useLocation();

  return (
    <InterviewProvider>
      <div className="min-h-screen bg-[#080b16] text-slate-100">
        <div className="fixed right-6 top-6 z-50">
          <ThemeToggle />
        </div>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <LandingPage />
                </motion.div>
              }
            />
            <Route
              path="/setup"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35 }}
                >
                  <InterviewSetup />
                </motion.div>
              }
            />
            <Route
              path="/interview"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <InterviewPage />
                </motion.div>
              }
            />
            <Route
              path="/complete"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <CompletePage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </InterviewProvider>
  );
}

export default App;

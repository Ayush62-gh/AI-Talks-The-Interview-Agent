import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import interviewRoutes from './routes/interview.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: env.FRONTEND_ORIGIN }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', interviewRoutes);

// Error middleware
app.use(errorHandler);

export default app;

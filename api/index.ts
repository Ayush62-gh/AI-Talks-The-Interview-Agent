import express from 'express';
import cors from 'cors';
import interviewRoutes from '../backend/src/routes/interview.routes.js';
import { errorHandler } from '../backend/src/middleware/error.middleware.js';
import { rateLimiter } from '../backend/src/middleware/rate-limit.js';
import { requestSizeLimiter, securityHeaders } from '../backend/src/middleware/security.middleware.js';

const app = express();

app.use(securityHeaders());
app.use(express.json({ limit: '1mb' }));
app.use(requestSizeLimiter(1024 * 1024));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', rateLimiter(60, 60_000), interviewRoutes);
app.use(errorHandler);

export default app;

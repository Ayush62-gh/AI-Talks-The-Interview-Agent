import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import interviewRoutes from './routes/interview.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rate-limit.js';
import { requestSizeLimiter, securityHeaders } from './middleware/security.middleware.js';

const app = express();

app.use(securityHeaders());
app.use(express.json({ limit: '1mb' }));
app.use(requestSizeLimiter(1024 * 1024));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', rateLimiter(60, 60_000), interviewRoutes);

// Error middleware
app.use(errorHandler);

export default app;

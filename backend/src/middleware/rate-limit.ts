import type { Request, Response, NextFunction } from 'express';

const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimiter(limit = 60, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const state = requests.get(ip);

    if (!state || state.resetAt <= now) {
      requests.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (state.count >= limit) {
      return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again shortly.' } });
    }

    state.count += 1;
    next();
  };
}

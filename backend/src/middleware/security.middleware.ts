import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';

export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });
}

export function requestSizeLimiter(limitBytes = 1024 * 1024) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const length = Number(req.headers['content-length'] ?? 0);
    if (length > limitBytes) {
      const error = new Error('Request body too large');
      (error as Error & { statusCode?: number }).statusCode = 413;
      return next(error);
    }
    next();
  };
}

import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

export interface RequestContextData {
  ipAddress?: string;
  userAgent?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextData>();

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const contextData: RequestContextData = {
    ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  };

  requestContext.run(contextData, () => {
    next();
  });
};

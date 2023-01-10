import { HttpError, initRedis } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // refactor this logic
  const { userId } = req.body;
  if (!userId) return next(new HttpError('Auth failed: 400', 401));
  let cacheUserId: string | null;

  try {
    cacheUserId = await initRedis.client.get(userId);
  } catch (error) {
    return next(new HttpError('Auth failed: 500', 401));
  }

  if (!cacheUserId) {
    return next(new HttpError('Auth failed: 401', 401));
  }
  next();
};

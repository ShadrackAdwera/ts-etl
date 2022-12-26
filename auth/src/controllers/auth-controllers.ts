import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';

const getCallback = (req: Request, res: Response, next: NextFunction) => {
  return res.redirect('/');
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut((err) => {
    if (err)
      return next(
        new HttpError(err instanceof Error ? err.message : 'Logout error', 500)
      );
    res.redirect('/login');
  });
};

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ user: req.user });
};

export { getCallback, logout, currentUser };

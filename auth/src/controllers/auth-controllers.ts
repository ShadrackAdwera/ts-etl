import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { User, UserDoc } from '../models/User';

const getCallback = (req: Request, res: Response, next: NextFunction) => {
  return res.redirect('http://localhost:3000');
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

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let foundUsers: { _id: string & UserDoc }[];

  try {
    foundUsers = await User.find({});
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  res.status(200).json({ count: foundUsers.length, users: foundUsers });
};

export { getCallback, logout, currentUser, getUsers };

import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';

import './utils/passport';
import { authRouter } from './routes/auth-routes';
import { HttpError } from '@adwesh/common';

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY!],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);

app.use((_req: Request, _res: Response, _next: NextFunction) => {
  throw new HttpError('This method / route does not exist!', 404);
});

app.use(
  (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }
    res
      .status(error.code || 500)
      .json({ message: error.message || 'An error occured, try again!' });
  }
);

export { app };

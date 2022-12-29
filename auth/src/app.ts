import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import session, { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';

import './utils/passport';
import { authRouter } from './routes/auth-routes';
import { HttpError } from '@adwesh/common';

const app = express();

app.use(express.json());
//CORS
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, PUT, PATCH, POST, DELETE, GET'
//   );
//   next();
// });

const sess: SessionOptions = {
  secret: process.env.COOKIE_KEY!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: app.get('env') === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  store: new MongoStore({
    collectionName: 'session',
    mongoUrl: process.env.MONGO_URI,
  }),
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie!.secure = true; // serve secure cookies
}

app.use(session(sess));
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

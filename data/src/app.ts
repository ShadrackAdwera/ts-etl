import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';
import { dataRouter } from './routes/data-routes';

const app = express();

app.use(express.json());

//routes
app.use('/data', dataRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError('This method / path does ot exist', 404);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An error occured' });
});

export { app };

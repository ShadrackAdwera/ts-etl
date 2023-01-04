import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import { EtlRouter } from './routes/etl-routes';

const app = express();

app.use(express.json());
app.use(fileUpload());

app.use('/etl', EtlRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError('Invalid method / Route', 404);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An error occured, try again' });
});

export { app };

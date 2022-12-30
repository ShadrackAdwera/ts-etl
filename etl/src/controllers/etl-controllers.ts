import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Etl, EtlDoc } from '../models/Etl';

const getUploadedDocs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let etls: (EtlDoc & { _id: Types.ObjectId })[];
  try {
    etls = await Etl.find();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured, try again',
        500
      )
    );
  }
  res.status(200).json({ count: etls.length, etls });
};

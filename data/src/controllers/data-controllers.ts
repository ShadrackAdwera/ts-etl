import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { StatType } from '../helpers/types';
import { DataRepo } from './../repo/repo';

const fetchMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let stats: StatType[];
  try {
    stats = await DataRepo.getAll();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'Error adding data into PG',
        500
      )
    );
  }

  res.status(200).json({ count: stats.length, stats });
};

export { fetchMatches };

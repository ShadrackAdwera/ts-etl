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

const addMatch = async (req: Request, res: Response, next: NextFunction) => {
  let response: StatType;
  // TODO: Add created by mongo id
  const {
    homeTeam,
    awayTeam,
    homeScored,
    awayScored,
    matchDay,
    ref,
    winner,
    season,
  }: StatType = req.body;

  try {
    response = await DataRepo.insert({
      awayScored,
      awayTeam,
      homeScored,
      homeTeam,
      matchDay,
      ref,
      season,
      winner,
    });
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error
          ? error.message
          : 'An error occured inserting data, try again',
        500
      )
    );
  }
  res.status(201).json({ message: 'Insert successful', data: response });
};

export { fetchMatches };

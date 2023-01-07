import { HttpError, natsWraper } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { CsvUploadedPublisher } from '../events/CsvUploadedPublisher';

import { Etl, EtlDoc } from '../models/Etl';
import { CsvFileReader } from '../utils/CsvReader';

interface IExpressFile {
  name: string;
  mv(path: string, callback: (err: any) => void): void;
  mv(path: string): Promise<void>;
  encoding: string;
  mimetype: string;
  data: Buffer;
  tempFilePath: string;
  truncated: boolean;
  size: number;
  md5: string;
}

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

const publishDataFromUploadedDoc = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Get document from request body
   * Extract data from document body
   * Sanitize data
   * Publish data extracted from doc, to be listened to by data service
   * Request pre-signed URL from s3 to upload the file to S3
   * Save the file in s3 using the pre-signed URL
   * Save the url alongside the id of the creator in MongoDB
   */
  // Get document from request body

  const error = validationResult(req);

  if (!error.isEmpty())
    return next(new HttpError('Provide the season for this file', 400));

  const { season } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }
  const uploadedFile = req.files.file as IExpressFile;

  // scope to csv only
  if (uploadedFile.mimetype !== 'text/csv') {
    return res.status(200).json({ message: 'Uplaod a CSV file' });
  }

  // extract data from document body
  const csvReader = new CsvFileReader(uploadedFile.data.toString('utf-8'));
  const records = csvReader
    .read()
    .filter((r) => r.homeTeam !== undefined && r.homeScored !== null);

  // possible refactor? publish as a string -

  // publish data extracted to data service - behind the scenes? Possible refactor.
  for (const record of records) {
    const {
      awayScored,
      awayTeam,
      homeScored,
      homeTeam,
      matchDay,
      ref,
      winner,
    } = record;
    await new CsvUploadedPublisher(natsWraper.client).publish({
      awayScored,
      awayTeam,
      homeScored,
      homeTeam,
      matchDay,
      ref,
      winner,
      season,
    });
  }

  res.status(200).json({ message: 'Data has been uploaded' });
};

export { getUploadedDocs, publishDataFromUploadedDoc };

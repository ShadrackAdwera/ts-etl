import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { parse } from 'csv-parse';

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
  const csvData: string[][] = [];
  if (!req.files || Object.keys(req.files).length === 0)
    return next(new HttpError('Please provide a file', 404));
  //@ts-ignore
  const parser = await parse(req.files.file.data, {
    trim: true,
    skip_empty_lines: true,
    delimiter: ':',
  });
  parser.on('readable', function () {
    //
  });

  /**
   * fileName : req.files.file.name
   * fileContent : req.files.file.data : buffer representation of the file
   */
};

export { getUploadedDocs, publishDataFromUploadedDoc };

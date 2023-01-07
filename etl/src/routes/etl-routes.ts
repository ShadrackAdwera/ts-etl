import { Router } from 'express';
import { body } from 'express-validator';

import {
  getUploadedDocs,
  publishDataFromUploadedDoc,
} from '../controllers/etl-controllers';

const router = Router();

router.get('', getUploadedDocs);
router.post(
  '',
  [body('season').trim().not().isEmpty()],
  publishDataFromUploadedDoc
);

export { router as EtlRouter };

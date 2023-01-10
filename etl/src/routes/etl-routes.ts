import { Router } from 'express';
import { body } from 'express-validator';

import {
  getUploadedDocs,
  publishDataFromUploadedDoc,
} from '../controllers/etl-controllers';
import { checkAuth } from '../middlewares/checkAuth';

const router = Router();

router.get('', checkAuth, getUploadedDocs);
router.post(
  '',
  checkAuth,
  [body('season').trim().not().isEmpty()],
  publishDataFromUploadedDoc
);

export { router as EtlRouter };

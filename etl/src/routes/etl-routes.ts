import { Router } from 'express';

import {
  getUploadedDocs,
  publishDataFromUploadedDoc,
} from '../controllers/etl-controllers';

const router = Router();

router.get('', getUploadedDocs);
router.post('', publishDataFromUploadedDoc);

export { router as EtlRouter };

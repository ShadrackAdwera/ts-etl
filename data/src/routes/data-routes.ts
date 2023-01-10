import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';

import { fetchMatches } from './../controllers/data-controllers';

const router = Router();

// add auth middleware
router.get('', checkAuth, fetchMatches);

export { router as dataRouter };

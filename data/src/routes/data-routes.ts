import { Router } from 'express';

import { fetchMatches } from './../controllers/data-controllers';

const router = Router();

// add auth middleware
router.get('', fetchMatches);

export { router as dataRouter };

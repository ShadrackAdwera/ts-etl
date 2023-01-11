import { Router } from 'express';

import { checkAuth } from '../middlewares/checkAuth';

import {
  fetchMatches,
  addMatch,
  deleteMatch,
  updateMatch,
} from './../controllers/data-controllers';

const router = Router();

router.get('', checkAuth, fetchMatches);
router.post('', [], addMatch);
router.patch('/:id', [], updateMatch);
router.delete(':/id', [], deleteMatch);

export { router as dataRouter };

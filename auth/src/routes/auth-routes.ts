import passport from 'passport';
import { Router } from 'express';

import {
  getCallback,
  logout,
  currentUser,
} from '../controllers/auth-controllers';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), getCallback);
router.get('/logout', logout);
router.get('/current-user', currentUser);

export { router as authRouter };

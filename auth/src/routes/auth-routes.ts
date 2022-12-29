import passport from 'passport';
import { Router } from 'express';

import checkAuth from '../middlewares/checkAuth';
import {
  getCallback,
  logout,
  currentUser,
  getUsers,
} from '../controllers/auth-controllers';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), getCallback);
router.get('/logout', logout);
router.get('/current-user', currentUser);
//TODO: Auth Middleware
router.get('/users', checkAuth, getUsers);

export { router as authRouter };

import express, { Router } from 'express';
import { register, login, me } from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Route for user creation
router.post('/register', register);

// Route for user login
router.post('/login', login);

router.post('/me', auth, me);

export default router;

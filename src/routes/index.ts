import { Router } from 'express';
import userRouter from './user';
import teamRouter from './teams';
import fixtureRouter from './fixtures';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req, res) => res.send('OK'));

// mount user route
router.use('/users', userRouter);

// mount team route
router.use('/teams', teamRouter);

// mount fixtures route
router.use('/fixtures', fixtureRouter);

export default router;

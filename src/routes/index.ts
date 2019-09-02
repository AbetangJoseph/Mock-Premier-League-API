import { Router } from 'express';
import userRouter from './user';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req, res) => res.send('OK'));

// mount user route
router.use('/user', userRouter);

export default router;

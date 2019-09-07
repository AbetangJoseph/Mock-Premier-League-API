import { Router } from 'express';
import userRouter from './user';
import teamRouter from './teams';
import fixtureRouter from './fixtures';

const router = Router();

/** GET /health-check - Check service health */
router.get('/', (_req, res) =>
  res.json({
    status: 'Ok',
    usersOp: '/users/login, /users/signup',
    fixtures: '/fixtures',
    teams: '/teams, /teams:id',
  }),
);

// mount user route
router.use('/users', userRouter);

// mount team route
router.use('/teams', teamRouter);

// mount fixtures route
router.use('/fixtures', fixtureRouter);

export default router;

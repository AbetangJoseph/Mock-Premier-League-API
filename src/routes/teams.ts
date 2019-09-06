import express, { Router } from 'express';
import { validateTeam, validateTeamUpdate } from '../validation/teams';
import { add, remove, edit, viewAll } from '../controllers/teams';
import auth from '../middleware/auth';
import authAdmin from '../middleware/auth.admin';

import _ from 'lodash';

const router = Router();

router.use(auth);
router.route('/').get(async (_req: express.Request, res: express.Response) => {
  const response = await viewAll();
  res.status(200).json({ success: true, data: response });
});

router.use(authAdmin);
router.route('/').post(async (req: express.Request, res: express.Response) => {
  const body = req.body;
  const { error, value: request } = validateTeam(
    _.pick(body, [
      'clubName',
      'clubCodeName',
      'founded',
      'coach',
      'logo',
      'country',
      'stadium',
      'stadiumCapacity',
    ]),
  );

  if (error) {
    res
      .status(400)
      .json({ error: error.details[0].message.replace(/\"/g, '') });
    return;
  }

  try {
    const response = await add(request);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router
  .route('/:id')
  .delete(async (req: express.Request, res: express.Response) => {
    const teamId = req.params.id;
    try {
      const response = await remove(teamId);
      res.status(200).json({ success: true, data: { id: response } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .put(async (req: express.Request, res: express.Response) => {
    const teamId = req.params.id;
    const { error, value: request } = validateTeamUpdate(req.body);

    if (error) {
      res
        .status(400)
        .json({ error: error.details[0].message.replace(/\"/g, '') });
      return;
    }

    try {
      const response = await edit(teamId, request);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;

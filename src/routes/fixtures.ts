import express, { Router } from 'express';
import { add } from '../controllers/fixtures';
import { validateFixture } from '../validation/fixtures';
import auth from '../middleware/auth';
import authAdmin from '../middleware/auth.admin';
import _ from 'lodash';

const router = Router();

router.use(auth);
router.use(authAdmin);
router.route('/').post(async (req: express.Request, res: express.Response) => {
  const body = req.body;

  const { error, value: request } = validateFixture(
    _.pick(body, ['home', 'away', 'venue', 'time', 'date']),
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

export default router;

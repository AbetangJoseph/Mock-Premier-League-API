import express, { Router } from 'express';
import {
  add,
  remove,
  edit,
  viewAll,
  viewCompleted,
  viewPending,
  searchFixture,
  getLink,
} from '../controllers/fixtures';
import { validateFixture, validateFixtureUpdate } from '../validation/fixtures';
import auth from '../middleware/auth';
import authAdmin from '../middleware/auth.admin';
import _ from 'lodash';

const router = Router();

router.get('/search', async (req: express.Request, res: express.Response) => {
  const query = req.query;

  const { error, value: queryParams } = validateFixtureUpdate(query);

  if (error) {
    res
      .status(400)
      .json({ error: error.details[0].message.replace(/\"/g, '') });
    return;
  }

  try {
    const response = await searchFixture(queryParams);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.use(auth);
router.get(
  '/complete',
  async (_req: express.Request, res: express.Response) => {
    const response = await viewCompleted();
    res.status(200).json({ success: true, data: response });
  },
);

router.get('/pending', async (_req: express.Request, res: express.Response) => {
  const response = await viewPending();
  res.status(200).json({ success: true, data: response });
});

router.get('/:id', async (req: express.Request, res: express.Response) => {
  const URL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  console.log(URL);

  try {
    const response = await getLink(URL);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.use(authAdmin);
router
  .route('/')
  .post(async (req: express.Request, res: express.Response) => {
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
  })
  .get(async (_req: express.Request, res: express.Response) => {
    const response = await viewAll();
    res.status(200).json({ success: true, data: response });
  });

router
  .route('/:id')
  .delete(async (req: express.Request, res: express.Response) => {
    const fixtureId = req.params.id;
    try {
      const response = await remove(fixtureId);
      res.status(200).json({ success: true, data: { id: response } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .put(async (req: express.Request, res: express.Response) => {
    const fixtureId = req.params.id;
    const { error, value: request } = validateFixtureUpdate(req.body);

    if (error) {
      res
        .status(400)
        .json({ error: error.details[0].message.replace(/\"/g, '') });
      return;
    }

    try {
      const response = await edit(fixtureId, request);
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;

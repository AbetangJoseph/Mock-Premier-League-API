import express, { Router } from 'express';
import { signup, login } from '../controllers/user';
import { validateSignup, validateLogin } from '../validation/user';
import _ from 'lodash';

const router = Router();

router.route('/signup').post(async (req, res) => {
  const { error, value } = validateSignup(
    _.pick(req.body, ['username', 'email', 'password', 'isAdmin']),
  );

  if (error) {
    res
      .status(400)
      .json({ error: error.details[0].message.replace(/\"/g, '') });
    return;
  }

  try {
    const response = await signup(value);
    const { username, email, id, isAdmin } = response;
    res.status(200).json({ data: { username, email, id, isAdmin } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router
  .route('/login')
  .post(async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const { error, value: request } = validateLogin(
      _.pick(body, ['email', 'password']),
    );

    if (error) {
      res
        .status(400)
        .json({ error: error.details[0].message.replace(/\"/g, '') });
      return;
    }

    try {
      const response = await login(request);
      res.status(200).json({ success: true, ...response });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;

import { Router } from 'express';
import { signup } from '../controllers/user';
import { validateSignup } from '../validation/user';
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
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

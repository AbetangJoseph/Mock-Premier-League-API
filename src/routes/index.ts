import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', function(_req, res) {
  res.status(200).json({ message: 'All is well, home for index' });
});

export default router;

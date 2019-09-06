import { Request, Response, NextFunction } from 'express';

const authAdmin = (_req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.payload.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

export default authAdmin;

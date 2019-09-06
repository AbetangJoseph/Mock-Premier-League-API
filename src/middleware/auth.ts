import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    res.status(403).send({
      error: 'You must login',
    });

    return;
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    res.status(403).send({
      error: 'Forbidden',
    });

    return;
  }

  jwt.verify(
    token,
    `${process.env.JWT_SECRET}`,

    {
      issuer: 'STERLING',
    },
    (error: any, decoded: any) => {
      if (error) {
        res.status(500).json({
          message: error.message,
        });

        return;
      }

      (<AuthedRequest>res.locals).payload = decoded;
      next();
    },
  );

  interface AuthedRequest extends Request {
    payload: {
      isAdmin: boolean;
      username: string;
      _id: string;
      iat: number;
      exp: number;
      iss: string;
    };
  }
};

export default authMiddleWare;

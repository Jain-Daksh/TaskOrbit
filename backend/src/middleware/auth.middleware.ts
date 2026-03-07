import jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  req.user = decoded;
  next();
};

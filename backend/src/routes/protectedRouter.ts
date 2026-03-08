import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

export function createProtectedRouter(): Router {
  const router = Router();
  router.use(authMiddleware);
  return router;
}

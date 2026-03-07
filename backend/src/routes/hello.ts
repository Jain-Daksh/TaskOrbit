import express from 'express';
import type { Request, Response } from 'express';

export default (router: express.Router) => {
  router.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello World!' });
  });
};

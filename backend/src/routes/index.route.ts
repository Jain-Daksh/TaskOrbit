import express from 'express';
import helloRouter from './hello.route';
import authRouter from './auth.route';
import workspaceRouter from './workspace.route';

const router = express.Router();

router.use(helloRouter);
router.use('/auth', authRouter);

router.use('/workspaces', workspaceRouter);

export default router;

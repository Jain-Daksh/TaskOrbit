import express from 'express';
import helloRouter from './hello.route';
import authRouter from './auth.route';
import workspaceRouter from './workspace.route';
import TierRouter from './tier.route';
import ProjectRouter from './project.route';

const router = express.Router();

router.use(helloRouter);
router.use('/auth', authRouter);
router.use('/tier', TierRouter);
router.use('/projects', ProjectRouter);

router.use('/workspaces', workspaceRouter);

export default router;

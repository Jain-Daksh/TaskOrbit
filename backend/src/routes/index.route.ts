import express from 'express';
import helloRouter from './hello.route';
import authRouter from './auth.route';
const router = express.Router();

router.use(helloRouter);
router.use(authRouter);

export default router;

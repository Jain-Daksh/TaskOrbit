import express from 'express';
import helloRouter from './hello';
const router = express.Router();

helloRouter(router);

export default router;

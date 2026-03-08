import { Router } from 'express';
import { TierController } from '../controllers/tier.controller';

const router = Router();

router.get('/', TierController.getTiers);

export default router;

import { createProtectedRouter } from './protectedRouter';
import { DashboardController } from '../controllers/dashboard.controller';

const router = createProtectedRouter();

router.get('/', (req, res) => DashboardController.getDashboard(req, res));

export default router;

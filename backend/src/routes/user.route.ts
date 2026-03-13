import { createProtectedRouter } from './protectedRouter';
import { UserController } from '../controllers/user.controller';

const router = createProtectedRouter();

router.get('/profile', UserController.getProfile);

router.put('/profile', UserController.updateProfile);

router.put('/password', UserController.updatePassword);

export default router;

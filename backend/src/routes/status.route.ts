import { createProtectedRouter } from './protectedRouter';
import { StatusController } from '../controllers/status.controller';

const router = createProtectedRouter();

router.post('/', StatusController.createStatus);

router.get('/:workspaceId', StatusController.getStatuses);

router.get('/single/:statusId', StatusController.getStatus);

router.put('/:statusId', StatusController.updateStatus);

router.delete('/:statusId', StatusController.deleteStatus);

router.put('/reorder', StatusController.reorderStatuses);

export default router;

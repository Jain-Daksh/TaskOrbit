import { createProtectedRouter } from './protectedRouter';
import { WorkspaceController } from '../controllers/workspace.controller';

const router = createProtectedRouter();

router.get('/', (req, res) => WorkspaceController.getWorkspaces(req, res));
router.post('/', (req, res) => WorkspaceController.createWorkspace(req, res));
router.get('/:id', (req, res) => WorkspaceController.getWorkspace(req, res));

export default router;

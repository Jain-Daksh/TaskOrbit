import { createProtectedRouter } from './protectedRouter';
import { ProjectController } from '../controllers/project.controller';

const router = createProtectedRouter();

router.post('/', (req, res) => ProjectController.createProject(req, res));

router.get('/workspace/:workspaceId/:projectId', (req, res) =>
  ProjectController.getProject(req, res),
);
// router.get('/workspace/:workspaceId', (req, res) =>
//   ProjectController.getProjects(req, res),
// );

router.put('/:projectId', (req, res) =>
  ProjectController.updateProject(req, res),
);

router.delete('/:projectId', (req, res) =>
  ProjectController.deleteProject(req, res),
);

export default router;

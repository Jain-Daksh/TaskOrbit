import { createProtectedRouter } from './protectedRouter';
import { TaskController } from '../controllers/task.controller';

const router = createProtectedRouter();

router.post('/', (req, res) => TaskController.createTask(req, res));

router.get('/project/:projectId', (req, res) =>
  TaskController.getTasks(req, res),
);

router.get('/:taskId', (req, res) => TaskController.getTask(req, res));

router.put('/:taskId', (req, res) => TaskController.updateTask(req, res));

router.delete('/:taskId', (req, res) => TaskController.deleteTask(req, res));

export default router;

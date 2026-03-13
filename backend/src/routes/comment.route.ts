import { createProtectedRouter } from './protectedRouter';
import { CommentController } from '../controllers/comment.controller';

const router = createProtectedRouter();

router.post('/', CommentController.createComment);
router.get('/task/:taskId', CommentController.getComments);
router.get('/:commentId', CommentController.getComment);
router.put('/:commentId', CommentController.updateComment);
router.delete('/:commentId', CommentController.deleteComment);

export default router;

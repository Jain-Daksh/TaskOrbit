import { createProtectedRouter } from './protectedRouter';
import { WorkspaceMemberController } from '../controllers/workspace.member.controller';

const router = createProtectedRouter();

router.post('/:id/members', (req, res) =>
  WorkspaceMemberController.addMember(req, res),
);
router.delete('/:id/members/:memberId', (req, res) =>
  WorkspaceMemberController.removeMember(req, res),
);
export default router;

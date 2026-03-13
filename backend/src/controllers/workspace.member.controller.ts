import { Request, Response } from 'express';
import { WorkspaceMemberService } from '../service/workspace.member.service';
import { Failed, Success } from '../utils/apiResponse';

const workspaceService = new WorkspaceMemberService();

export class WorkspaceMemberController {
  static async addMember(req: Request, res: Response) {
    try {
      const workspaceId = req.body.workspaceId;
      const newUserId = req.body.userId;
      const roleName = req.body.roleName || 'Member';
      const adminUserId = req.user!.userId;

      const member = await workspaceService.addWorkspaceMember(
        workspaceId,
        adminUserId,
        newUserId,
        roleName,
      );

      return Success(res, 'Member added successfully', member);
    } catch (error: any) {
      return Failed(res, error.message, 400, error);
    }
  }

  static async removeMember(req: Request, res: Response) {
    try {
      const workspaceId = req.body.workspaceId;
      const memberUserId = req.body.userId;
      const adminUserId = req.user!.userId;

      const removed = await workspaceService.removeWorkspaceMember(
        workspaceId,
        adminUserId,
        memberUserId,
      );

      return Success(res, 'Member removed successfully', removed);
    } catch (error: any) {
      return Failed(res, error.message, 400, error);
    }
  }
}

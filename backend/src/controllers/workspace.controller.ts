import { Request, Response } from 'express';
import { WorkspaceService } from '../service/workspace.service';
import { Failed, Success } from '../utils/apiResponse';

const workspaceService = new WorkspaceService();

export class WorkspaceController {
  static async createWorkspace(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const workspace = await workspaceService.createWorkspace(userId, {
        name: req.body.name,
        tierId: req.body.tierId,
      });
      return Success(res, 'Workspace created Successfully', workspace);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to create workspace ',
        400,
        error,
      );
    }
  }

  static async getWorkspaces(req: Request, res: Response) {
    const userId = req.user!.userId;

    const workspaces = await workspaceService.getUserWorkspaces(userId);

    return Success(res, 'Here is workspace data', workspaces);
  }

  static async getWorkspace(req: Request, res: Response) {
    const userId = req.user!.userId;
    const workspaceId = req.params.id as string;

    try {
      const workspace = await workspaceService.getWorkspace(
        workspaceId,
        userId,
      );
      return Success(res, 'Workspace Info', workspace);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to get workspace info',
        400,
        error,
      );
    }
  }

  static async editWorkspace(req: Request, res: Response) {
    const userId = req.user!.userId;
    const workspaceId = req.params.id as string;
    const name = req.body.name;
    try {
      const workspace = await workspaceService.updateWorkspace(
        workspaceId,
        userId,
        name,
      );
      return Success(res, 'Workspace Info', workspace);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to update workspace info',
        400,
        error,
      );
    }
  }
}

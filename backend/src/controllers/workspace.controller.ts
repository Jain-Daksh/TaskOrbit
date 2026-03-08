import { Request, Response } from 'express';
import { WorkspaceService } from '../service/workspace.service';

const workspaceService = new WorkspaceService();

export class WorkspaceController {
  async createWorkspace(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const workspace = await workspaceService.createWorkspace(userId, {
        name: req.body.name,
        tierId: req.body.tierId,
      });

      res.json(workspace);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create workspace' });
    }
  }

  async getWorkspaces(req: Request, res: Response) {
    const userId = req.user!.userId;

    const workspaces = await workspaceService.getUserWorkspaces(userId);

    res.json(workspaces);
  }

  async getWorkspace(req: Request, res: Response) {
    const userId = req.user!.userId;
    const workspaceId = req.params.id as string;

    const workspace = await workspaceService.getWorkspace(workspaceId, userId);

    res.json(workspace);
  }
}

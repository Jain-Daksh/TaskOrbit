import { Request, Response } from 'express';
import { StatusService } from '../service/status.service';
import { Failed, Success } from '../utils/apiResponse';

const statusService = new StatusService();

export class StatusController {
  static async createStatus(req: Request, res: Response) {
    try {
      const { workspaceId, name } = req.body;
      const userId = req.user!.userId;

      const status = await statusService.createStatus(userId, {
        workspaceId,
        name,
      });

      return Success(res, 'Status created successfully', status);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to create Status',
        400,
        error,
      );
    }
  }

  static async getStatuses(req: Request, res: Response) {
    try {
      const workspaceId = req.params.workspaceId as string;

      const statuses = await statusService.getStatuses(workspaceId);

      return Success(res, 'Statuses fetched successfully', statuses);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to fetch Statuses',
        400,
        error,
      );
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      const statusId = req.params.statusId as string;

      const status = await statusService.getStatus(statusId);

      if (!status) {
        return Failed(res, 'Status not found', 404);
      }

      return Success(res, 'Status fetched successfully', status);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to fetch Status', 400, error);
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const statusId = req.params.statusId as string;
      const { name } = req.body;

      const status = await statusService.updateStatus(userId, statusId, {
        name,
      });

      return Success(res, 'Status updated successfully', status);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to update Status',
        400,
        error,
      );
    }
  }

  static async deleteStatus(req: Request, res: Response) {
    try {
      const statusId = req.params.statusId as string;
      const userId = req.user!.userId;

      const deletedStatus = await statusService.deleteStatus(userId, statusId);

      return Success(res, 'Status deleted successfully', deletedStatus);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to delete Status',
        400,
        error,
      );
    }
  }

  static async reorderStatuses(req: Request, res: Response) {
    try {
      const statuses = req.body.statuses;
      const userId = req.user!.userId;
      const workspaceId = req.body.workspaceId as string;
      if (!workspaceId) {
        return Failed(res, 'workspaceId is required', 400);
      }

      if (!Array.isArray(statuses) || statuses.length === 0) {
        return Failed(res, 'No statuses provided', 400);
      }
      console.log('test', userId, workspaceId, statuses);
      const result = await statusService.reorderStatuses(
        userId,
        workspaceId,
        statuses,
      );

      return Success(res, 'Statuses reordered successfully', result);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to reorder Statuses',
        400,
        error,
      );
    }
  }
}

import { Request, Response } from 'express';
import { ProjectService } from '../service/project.service';
import { Failed, Success } from '../utils/apiResponse';

const projectService = new ProjectService();

export class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const project = await projectService.createProject(userId, {
        name: req.body.name,
        workspaceId: req.body.workspaceId,
      });
      return Success(res, 'Project created Successfully', project);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to create Project',
        400,
        error,
      );
    }
  }

  static async getProjects(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const workspaceId = req.params.workspaceId as string;
      const projects = await projectService.getProjects(workspaceId, userId);
      return Success(res, 'Projects fetched successfully', projects);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to fetch Projects',
        400,
        error,
      );
    }
  }

  static async getProject(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const workspaceId = req.params.workspaceId as string;
      const projectId = req.params.projectId as string;

      const project = await projectService.getProject(
        workspaceId,
        projectId,
        userId,
      );
      if (!project) return Failed(res, 'Project not found', 404);

      return Success(res, 'Project fetched successfully', project);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to fetch Project',
        400,
        error,
      );
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const projectId = req.params.projectId as string;
      const name = req.body.name;

      const project = await projectService.updateProject(
        projectId,
        userId,
        name,
      );
      return Success(res, 'Project updated successfully', project);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to update Project',
        400,
        error,
      );
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const projectId = req.params.projectId as string;

      const deletedProject = await projectService.deleteProject(
        projectId,
        userId,
      );
      return Success(res, 'Project deleted successfully', deletedProject);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to delete Project',
        400,
        error,
      );
    }
  }
}

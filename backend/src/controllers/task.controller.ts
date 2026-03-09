import { Request, Response } from 'express';
import { TaskService } from '../service/task.service';
import { Failed, Success } from '../utils/apiResponse';

const taskService = new TaskService();

export class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const task = await taskService.createTask(userId, {
        title: req.body.title,
        description: req.body.description,
        projectId: req.body.projectId,
        statusId: req.body.statusId,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        assigneeId: req.body.assigneeId,
      });

      return Success(res, 'Task created successfully', task);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to create task', 400, error);
    }
  }

  static async getTasks(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const projectId = req.params.projectId as string;

      const tasks = await taskService.getTasks(projectId, userId);

      return Success(res, 'Tasks fetched successfully', tasks);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to fetch tasks', 400, error);
    }
  }

  static async getTask(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.taskId as string;

      const task = await taskService.getTask(taskId, userId);

      if (!task) return Failed(res, 'Task not found', 404);

      return Success(res, 'Task fetched successfully', task);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to fetch task', 400, error);
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.taskId as string;

      const task = await taskService.updateTask(taskId, userId, req.body);

      return Success(res, 'Task updated successfully', task);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to update task', 400, error);
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.taskId as string;

      const task = await taskService.deleteTask(taskId, userId);

      return Success(res, 'Task deleted successfully', task);
    } catch (error: any) {
      return Failed(res, error.message || 'Failed to delete task', 400, error);
    }
  }
}

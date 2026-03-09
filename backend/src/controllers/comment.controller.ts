import { Request, Response } from 'express';
import { CommentService } from '../service/comment.service';
import { Success, Failed } from '../utils/apiResponse';

const commentService = new CommentService();

export class CommentController {
  static async createComment(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { taskId, content } = req.body;

      const comment = await commentService.createComment(userId, {
        taskId,
        content,
      });
      return Success(res, 'Comment created successfully', comment);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to create comment',
        400,
        error,
      );
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.taskId as string;

      const comments = await commentService.getComments(taskId, userId);
      return Success(res, 'Comments fetched successfully', comments);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to fetch comments',
        400,
        error,
      );
    }
  }

  static async getComment(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const commentId = req.params.commentId as string;

      const comment = await commentService.getComment(commentId, userId);
      if (!comment) return Failed(res, 'Comment not found', 404);

      return Success(res, 'Comment fetched successfully', comment);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to fetch comment',
        400,
        error,
      );
    }
  }

  static async updateComment(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const commentId = req.params.commentId as string;
      const { content } = req.body;

      const comment = await commentService.updateComment(
        commentId,
        userId,
        content,
      );
      return Success(res, 'Comment updated successfully', comment);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to update comment',
        400,
        error,
      );
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const commentId = req.params.commentId as string;

      const comment = await commentService.deleteComment(commentId, userId);
      return Success(res, 'Comment deleted successfully', comment);
    } catch (error: any) {
      return Failed(
        res,
        error.message || 'Failed to delete comment',
        400,
        error,
      );
    }
  }
}

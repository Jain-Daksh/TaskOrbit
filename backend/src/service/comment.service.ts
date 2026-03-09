import { prisma } from '../../prisma/client';

export class CommentService {
  async createComment(
    userId: string,
    data: { taskId: string; content: string },
  ) {
    const task = await prisma.task.findFirst({
      where: {
        id: data.taskId,
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
    });

    if (!task) throw new Error('Task not found or access denied');

    return prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        userId,
      },
    });
  }

  async getComments(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspace: {
            members: {
              some: { userId },
            },
          },
        },
      },
    });

    if (!task) throw new Error('Access denied');

    return prisma.comment.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getComment(commentId: string, userId: string) {
    return prisma.comment.findFirst({
      where: {
        id: commentId,
        task: {
          project: {
            workspace: {
              members: {
                some: { userId },
              },
            },
          },
        },
      },
      include: { user: true, task: true },
    });
  }

  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, userId },
    });

    if (!comment) throw new Error('Comment not found or not authorized');

    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId, userId },
    });

    if (!comment) throw new Error('Comment not found or not authorized');

    return prisma.comment.delete({
      where: { id: commentId },
    });
  }
}

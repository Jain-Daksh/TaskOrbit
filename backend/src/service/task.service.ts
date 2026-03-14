import { prisma } from '../../prisma/client';

export class TaskService {
  async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      projectId: string;
      statusId: string;
      priority: any;
      dueDate?: Date;
      assigneeId?: string;
    },
  ) {
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
    });

    if (!project) throw new Error('User is not a member of this workspace');

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority ?? 'LOW',
        projectId: data.projectId,
        statusId: data.statusId,
        assigneeId: data.assigneeId,
        createdBy: userId,
      },
    });
  }

  async getTasks(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) throw new Error('Access denied');

    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        status: true,
      },
    });
  }

  async getTask(taskId: string, userId: string) {
    return prisma.task.findFirst({
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
      include: {
        assignee: true,
        status: true,
        comments: true,
      },
    });
  }

  async updateTask(taskId: string, userId: string, data: any) {
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

    if (!task) throw new Error('Task not found or access denied');

    return prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
        statusId: data.statusId,
        assigneeId: data.assigneeId,
      },
    });
  }

  async deleteTask(taskId: string, userId: string) {
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

    if (!task) throw new Error('Task not found or access denied');

    await prisma.comment.deleteMany({
      where: { taskId },
    });

    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}

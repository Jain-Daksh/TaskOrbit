import { config } from '../../config/bussiness.Config';
import { prisma } from '../../prisma/client';

export class ProjectService {
  async createProject(
    userId: string,
    data: { name: string; workspaceId: string },
  ) {
    const member = await prisma.workspaceMember.findFirst({
      where: { userId, workspaceId: data.workspaceId },
    });
    if (!member) throw new Error('User is not a member of this workspace');
    const projectCount = await prisma.project.count({
      where: { workspaceId: data.workspaceId },
    });

    if (projectCount >= config.maxProject) {
      throw new Error(
        `You can only create up to ${config.maxProject} projects in this workspace.`,
      );
    }

    return prisma.project.create({
      data: {
        name: data.name,
        workspaceId: data.workspaceId,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getProjects(workspaceId: string, userId: string) {
    const isMemberOfWorkSpace = await prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });
    if (!isMemberOfWorkSpace) throw new Error('Not a member of this workspace');
    const projectInfo = await prisma.project.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });

    return projectInfo;
  }

  async getProject(workspaceId: string, projectId: string, userId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });
  }

  async updateProject(projectId: string, userId: string, name: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, createdBy: userId },
    });

    if (!project) throw new Error('Only project owner can update project');

    return prisma.project.update({
      where: { id: projectId },
      data: { name },
    });
  }

  async deleteProject(projectId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: projectId, createdBy: userId },
      });
      if (!project) throw new Error('Only project owner can delete project');

      const tasks = await tx.task.findMany({
        where: { projectId: projectId },
        select: { id: true },
      });

      const taskIds = tasks.map((t) => t.id);

      await tx.comment.deleteMany({
        where: { taskId: { in: taskIds } },
      });

      await tx.task.deleteMany({
        where: { projectId: projectId },
      });

      return tx.project.delete({
        where: { id: projectId },
      });
    });
  }
}

import { config } from '../../config/bussiness.Config';
import { prisma } from '../../prisma/client';

export class WorkspaceService {
  async createWorkspace(
    userId: string,
    data: { name: string; tierId: string },
  ) {
    const userWorkspacesCount = await prisma.workspace.count({
      where: { ownerId: userId },
    });

    if (userWorkspacesCount >= config.maxWorkSpace) {
      throw new Error(
        `You can only create up to ${config.maxWorkSpace} workspaces.`,
      );
    }

    const adminRole = await prisma.role.findFirst({
      where: {
        name: 'Admin',
      },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }
    let tId = data?.tierId;
    if (!data?.tierId) {
      const tier = await prisma.tier.findFirst({
        where: {
          price: 0,
        },
      });
      tId = tier?.id ?? '';
    }
    return prisma.workspace.create({
      data: {
        name: data.name,
        tierId: tId,
        ownerId: userId,
        members: {
          create: {
            userId,
            roleId: adminRole?.id,
          },
        },
      },
    });
  }

  async getUserWorkspaces(userId: string) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: true,
        _count: {
          select: { members: true },
        },
      },
    });

    // Map the count to totalMembers for easier frontend usage
    return workspaces.map((ws) => ({
      ...ws,
      totalMembers: ws._count.members,
    }));
  }

  async getWorkspace(workspaceId: string, userId: string) {
    return prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: true,
            role: true,
          },
        },
        statuses: true,
        projects: true,
      },
    });
  }

  async updateWorkspace(workspaceId: string, userId: string, name: string) {
    const adminRole = await prisma.role.findFirst({
      where: {
        name: 'Admin',
      },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        roleId: adminRole?.id,
      },
    });

    if (!member) throw new Error('Only admin can update workspace');

    return prisma.workspace.update({
      where: { id: workspaceId },
      data: { name },
    });
  }

  async deleteWorkspace(workspaceId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.findFirst({
        where: { id: workspaceId, ownerId: userId },
      });
      if (!workspace) throw new Error('Only owner can delete workspace');

      await tx.workspaceMember.deleteMany({
        where: { workspaceId },
      });

      const projects = await tx.project.findMany({
        where: { workspaceId },
        select: { id: true },
      });
      const projectIds = projects.map((p) => p.id);

      if (projectIds.length > 0) {
        await tx.task.deleteMany({
          where: { projectId: { in: projectIds } },
        });

        await tx.status.deleteMany({
          where: { projectId: { in: projectIds } },
        });

        await tx.project.deleteMany({
          where: { id: { in: projectIds } },
        });
      }

      return await tx.workspace.delete({
        where: { id: workspaceId },
      });
    });
  }
}

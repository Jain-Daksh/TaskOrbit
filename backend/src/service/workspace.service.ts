import { prisma } from '../../prisma/client';

export class WorkspaceService {
  async createWorkspace(
    userId: string,
    data: { name: string; tierId: string },
  ) {
    const adminRole = await prisma.role.findFirst({
      where: {
        name: 'ADMIN',
      },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    return prisma.workspace.create({
      data: {
        name: data.name,
        tierId: data.tierId,
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
    return prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async getWorkspace(workspaceId: string, userId: string) {
    return prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: { userId },
        },
      },
    });
  }

  async updateWorkspace(workspaceId: string, userId: string, name: string) {
    const adminRole = await prisma.role.findFirst({
      where: {
        name: 'ADMIN',
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
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) throw new Error('Only owner can delete workspace');

    return prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }
}

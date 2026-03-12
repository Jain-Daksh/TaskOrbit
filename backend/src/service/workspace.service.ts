import { prisma } from '../../prisma/client';

export class WorkspaceService {
  async createWorkspace(
    userId: string,
    data: { name: string; tierId: string },
  ) {
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
        statuses:true,
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

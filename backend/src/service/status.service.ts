import { prisma } from '../../prisma/client';

export class StatusService {
  async createStatus(
    userId: string,
    data: { workspaceId: string; name: string },
  ) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const lastStatus = await prisma.status.findFirst({
      where: {
        workspaceId: data.workspaceId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const nextOrder = lastStatus ? lastStatus.order + 1 : 1;

    return prisma.status.create({
      data: {
        name: data.name,
        workspaceId: data.workspaceId,
        order: nextOrder,
        isActive: true,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async getStatuses(workspaceId: string) {
    return prisma.status.findMany({
      where: {
        workspaceId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getStatus(statusId: string) {
    return prisma.status.findUnique({
      where: {
        id: statusId,
      },
    });
  }

  async updateStatus(
    userId: string,
    statusId: string,
    data: { name?: string },
  ) {
    const status = await prisma.status.findUnique({
      where: { id: statusId },
    });

    if (!status) {
      throw new Error('Status not found');
    }

    return prisma.status.update({
      where: { id: statusId },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }

  async deleteStatus(statusId: string, userId: string) {
    const status = await prisma.status.findUnique({
      where: { id: statusId },
      include: {
        tasks: true,
      },
    });

    if (!status) {
      throw new Error('Status not found');
    }

    if (status.tasks.length > 0) {
      return prisma.status.update({
        where: { id: statusId },
        data: {
          isActive: false,
          updatedBy: userId,
        },
      });
    }

    return prisma.status.delete({
      where: { id: statusId },
    });
  }

  async reorderStatuses(
    userId: string,
    statuses: { id: string; order: number }[],
  ) {
    const updates = statuses.map((status) =>
      prisma.status.update({
        where: { id: status.id },
        data: { order: status.order, updatedBy: userId },
      }),
    );

    return prisma.$transaction(updates);
  }
  async getAllStatuses(workspaceId: string) {
    return prisma.status.findMany({
      where: {
        workspaceId,
      },
    });
  }
}

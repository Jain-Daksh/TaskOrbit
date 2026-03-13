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

  async getAllStatuses(workspaceId: string) {
    return prisma.status.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async reorderStatuses(
    userId: string,
    workspaceId: string,
    statuses: { id: string; order: number }[],
  ) {
    // Step 0: validate all statuses belong to this workspace
    const existingStatuses = await prisma.status.findMany({
      where: { workspaceId, id: { in: statuses.map((s) => s.id) } },
      select: { id: true },
    });

    const missing = statuses.filter(
      (s) => !existingStatuses.some((e) => e.id === s.id),
    );

    if (missing.length) {
      throw new Error(
        `Status IDs not found in this workspace: ${missing.map((m) => m.id).join(', ')}`,
      );
    }

    // Step 1: temporary orders to avoid unique conflicts
    const tempUpdates = statuses.map((status, idx) =>
      prisma.status.update({
        where: { id: status.id }, // ✅ update by ID only
        data: { order: idx + 1000, updatedBy: userId },
      }),
    );

    await prisma.$transaction(tempUpdates);

    // Step 2: assign final orders
    const finalUpdates = statuses.map((status) =>
      prisma.status.update({
        where: { id: status.id }, // ✅ update by ID only
        data: { order: status.order, updatedBy: userId },
      }),
    );

    return prisma.$transaction(finalUpdates);
  }
}

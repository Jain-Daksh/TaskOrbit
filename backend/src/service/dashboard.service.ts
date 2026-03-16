import { prisma } from '../../prisma/client';

export class DashboardService {
  static async getDashboard(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const [
      totalTasks,
      completedTasks,

      dueToday,
      dueTodayCount,

      dueTomorrow,
      dueTomorrowCount,

      overdue,
      overdueCount,

      recentTasks,
    ] = await Promise.all([
      prisma.task.count({
        where: { assigneeId: userId },
      }),

      prisma.task.count({
        where: {
          assigneeId: userId,
          status: { name: 'Done' },
        },
      }),

      // Today tasks
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          dueDate: {
            gte: today,
            lt: tomorrow,
          },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          projectId: true,
          project: { select: { name: true } },
        },
      }),

      prisma.task.count({
        where: {
          assigneeId: userId,
          dueDate: {
            gte: today,
            lt: tomorrow,
          },
          status: {
            name: { not: 'Done' },
          },
        },
      }),

      // Tomorrow tasks
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          dueDate: {
            gte: tomorrow,
            lt: dayAfterTomorrow,
          },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          projectId: true,
          project: { select: { name: true } },
        },
      }),

      prisma.task.count({
        where: {
          assigneeId: userId,
          dueDate: {
            gte: tomorrow,
            lt: dayAfterTomorrow,
          },
          status: {
            name: { not: 'Done' },
          },
        },
      }),

      // Overdue tasks
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          dueDate: { lt: today },
          status: {
            name: { not: 'Done' },
          },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          projectId: true,
          project: { select: { name: true } },
        },
      }),

      prisma.task.count({
        where: {
          assigneeId: userId,
          dueDate: { lt: today },
          status: {
            name: { not: 'Done' },
          },
        },
      }),

      // Recent tasks
      prisma.task.findMany({
        where: { assigneeId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          dueDate: true,
          projectId: true,
          project: { select: { name: true } },
        },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,

      dueToday,
      dueTodayCount,

      dueTomorrow,
      dueTomorrowCount,

      overdue,
      overdueCount,

      recentTasks,
    };
  }
}

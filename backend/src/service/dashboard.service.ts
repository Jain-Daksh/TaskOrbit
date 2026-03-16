import { prisma } from '../../prisma/client';

export class DashboardService {
  static async getDashboard(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [totalTasks, completedTasks, dueToday, overdue, recentTasks] =
      await Promise.all([
        prisma.task.count({
          where: { assigneeId: userId },
        }),

        prisma.task.count({
          where: {
            assigneeId: userId,
            status: {
              name: 'Done',
            },
          },
        }),

        prisma.task.findMany({
          where: {
            assigneeId: userId,
            dueDate: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),

        prisma.task.findMany({
          where: {
            assigneeId: userId,
            dueDate: {
              lt: today,
            },
            NOT: {
              status: {
                name: 'Done',
              },
            },
          },
        }),

        prisma.task.findMany({
          where: { assigneeId: userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    return {
      totalTasks,
      completedTasks,
      dueToday: dueToday.length,
      overdue: overdue.length,
      recentTasks,
    };
  }
}

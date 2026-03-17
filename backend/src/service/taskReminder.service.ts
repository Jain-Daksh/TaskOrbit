import { prisma } from '../../prisma/client';
import nodemailer from 'nodemailer';
import { config } from '../../config/bussiness.Config';

const transporter = nodemailer.createTransport({
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  auth: {
    user: config.SMTP.USER,
    pass: config.SMTP.PASS,
  },
});

export class TaskReminderService {
  static async sendReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const threeDaysAhead = new Date(today);
    threeDaysAhead.setDate(today.getDate() + 3);

    const threeDaysAheadEnd = new Date(threeDaysAhead);
    threeDaysAheadEnd.setHours(23, 59, 59, 999);

    const tasks3Days = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: threeDaysAhead,
          lte: threeDaysAheadEnd,
        },
        assigneeId: { not: null },
      },
      include: {
        assignee: true,
      },
    });

    for (const task of tasks3Days) {
      if (!task.assignee?.email) continue;

      await transporter.sendMail({
        from: `"${config.SMTP.FROM_NAME}" <${config.SMTP.FROM_EMAIL}>`,
        to: task.assignee.email,
        subject: `Task Reminder - ${task.title}`,
        html: `
          <h3>Task Reminder</h3>
          <p>Your task <b>${task.title}</b> is due in 3 days.</p>
          <p>Due Date: ${task.dueDate?.toDateString()}</p>
        `,
      });

      console.log(`3-day reminder sent for task: ${task.title}`);
    }

    const tasksToday = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: todayEnd,
        },
        assigneeId: { not: null },
      },
      include: { assignee: true },
    });

    for (const task of tasksToday) {
      if (!task.assignee?.email) continue;

      await transporter.sendMail({
        from: `"${config.SMTP.FROM_NAME}" <${config.SMTP.FROM_EMAIL}>`,
        to: task.assignee.email,
        subject: `Task Due Today - ${task.title}`,
        html: `
          <h3>Task Due Today</h3>
          <p>Your task <b>${task.title}</b> is due today.</p>
        `,
      });

      console.log(`Due-today reminder sent for task: ${task.title}`);
    }
  }
}

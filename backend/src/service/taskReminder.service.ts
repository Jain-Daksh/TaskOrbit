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
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const threeDays = new Date();
    threeDays.setDate(todayStart.getDate() + 3);
    threeDays.setHours(23, 59, 59, 999);

    // 3 day reminder
    const tasks3Days = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: todayStart,
          lte: threeDays,
        },
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
        <p>Due Date: ${task.dueDate}</p>
        `,
      });

      await prisma.task.update({
        where: { id: task.id },
        data: { reminder3DaysSent: true },
      });
    }

    // due today
    const tasksToday = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        assignee: true,
      },
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

      await prisma.task.update({
        where: { id: task.id },
        data: { reminderDueSent: true },
      });
    }
  }
}

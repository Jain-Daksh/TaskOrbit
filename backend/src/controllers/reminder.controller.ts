import { Request, Response } from 'express';
import { TaskReminderService } from '../service/taskReminder.service';
import { Success, Failed } from '../utils/apiResponse';

export class ReminderController {
  static async runTaskReminder(req: Request, res: Response) {
    try {
      await TaskReminderService.sendReminders();
      return Success(res, 'Reminder job executed', null);
    } catch (err: any) {
      return Failed(res, err.message || 'Reminder job failed', 500, err);
    }
  }
}

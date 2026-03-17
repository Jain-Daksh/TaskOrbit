import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller';

const router = Router();

router.get('/task-reminders', ReminderController.runTaskReminder);

export default router;

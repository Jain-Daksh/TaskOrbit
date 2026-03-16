import { Request, Response } from 'express';
import { DashboardService } from '../service/dashboard.service';
import { Failed, Success } from '../utils/apiResponse';

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const data = await DashboardService.getDashboard(userId);

      return Success(res, 'Dashboard data fetched successfully', data);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to fetch dashboard', 400, err);
    }
  }
}

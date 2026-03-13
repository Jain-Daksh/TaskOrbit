import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { Success, Failed } from '../utils/apiResponse';

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id; // Assuming you have middleware that sets req.user
      const user = await UserService.getProfile(userId);
      return Success(res, 'Profile fetched successfully', user);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to fetch profile', 400, err);
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;
      const updatedUser = await UserService.updateProfile(userId, { name, email });
      return Success(res, 'Profile updated successfully', updatedUser);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to update profile', 400, err);
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      await UserService.updatePassword(userId, oldPassword, newPassword);
      return Success(res, 'Password updated successfully', null);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to update password', 400, err);
    }
  }
}
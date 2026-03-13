import { Request, Response } from 'express';
import { OTPService } from '../service/otp.service';
import { Success, Failed } from '../utils/apiResponse';

export class OTPController {
  static async sendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await OTPService.sendOTP(email);
      return Success(res, 'OTP sent successfully', result);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to send OTP', 400, err);
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { email, code } = req.body;
      const result = await OTPService.verifyOTP(email, code);
      return Success(res, 'Email verified successfully', result);
    } catch (err: any) {
      return Failed(res, err.message || 'OTP verification failed', 400, err);
    }
  }
}

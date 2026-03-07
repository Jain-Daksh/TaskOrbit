import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { Failed, Success } from '../utils/apiResponse';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.signup(name, email, password);
      return Success(res, 'Signup successful', result);
    } catch (err: any) {
      return Failed(res, err.message || 'Signup failed', 400, err);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return Success(res, 'Login successful', result);
    } catch (err: any) {
      return Failed(res, err.message || 'Login failed', 400, err);
    }
  }
}
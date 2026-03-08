import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { Failed, Success } from '../utils/apiResponse';
import { COOKIE_OPTIONS } from '../../config/cookieConfig';

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
      const { accessToken, refreshToken, user } = await AuthService.login(
        email,
        password,
      );

      res.cookie('access_token', accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return Success(res, 'Login successful', {
        user,
        accessToken,
        refreshToken,
      });
    } catch (err: any) {
      return Failed(res, err.message || 'Login failed', 400, err);
    }
  }
}

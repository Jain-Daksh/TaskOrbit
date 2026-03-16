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
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken =
        req.cookies['refresh_token'] || req.body.refreshToken;
      if (!refreshToken) throw new Error('Refresh token missing');

      const tokens = await AuthService.refreshToken(refreshToken);

      res.cookie('access_token', tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie('refresh_token', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return Success(res, 'Token refreshed', tokens);
    } catch (err: any) {
      return Failed(res, err.message || 'Could not refresh token', 400, err);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) throw new Error('Email is required');

      const result = await AuthService.forgotPassword(email);
      return Success(res, result.message, null);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to send reset email', 400, err);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword)
        throw new Error('Token and new password are required');

      const result = await AuthService.resetPassword(token, newPassword);
      return Success(res, result.message, null);
    } catch (err: any) {
      return Failed(res, err.message || 'Failed to reset password', 400, err);
    }
  }

  static async verifyAccount(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new Error('Email and OTP are required');
      }

      const { user, token } = await AuthService.verifyAccount(email, otp);

      res.cookie('access_token', token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return Success(res, 'Account verified successfully', {
        user,
        token,
      });
    } catch (err: any) {
      return Failed(res, err.message || 'Verification failed', 400, err);
    }
  }
}

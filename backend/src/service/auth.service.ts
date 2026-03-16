import { prisma } from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/bussiness.Config';
import nodemailer from 'nodemailer';

const SALT_ROUNDS = config?.SALT_ROUNDS;
const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  static async signup(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '95m',
    });
    const refreshToken = uuidv4();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    const { password: _, ...safeUser } = user;

    return { accessToken, refreshToken, user: safeUser };
  }

  static async refreshToken(token: string) {
    const record = await prisma.refreshToken.findUnique({ where: { token } });
    if (!record) throw new Error('Invalid refresh token');

    if (record.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token } });
      throw new Error('Refresh token expired');
    }

    await prisma.refreshToken.delete({ where: { token } });

    const accessToken = jwt.sign(
      { userId: record.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' },
    );

    const newRefreshToken = uuidv4();
    await prisma.refreshToken.create({
      data: {
        userId: record.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'Logged out successfully' };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('No user found with this email');

    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const transporter = nodemailer.createTransport({
      host: config.SMTP.HOST,
      port: config.SMTP.PORT,
      auth: {
        user: config.SMTP.USER,
        pass: config.SMTP.PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"${config.SMTP.FROM_NAME}" <${config.SMTP.FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 1 hour.</p>`,
    });

    return { message: 'Password reset email sent' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record) throw new Error('Invalid or expired reset token');

    if (record.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      throw new Error('Reset token expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return { message: 'Password reset successfully' };
  }

  static async verifyAccount(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('No user found with this email');

    const verify = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        otp: otp,
        isUsed: false,
      },
    });

    if (!verify) throw new Error('Invalid or expired OTP');

    if (verify.expiresAt < new Date()) {
      throw new Error('OTP expired');
    }

    // mark otp as used
    await prisma.otp.update({
      where: { id: verify.id },
      data: { isUsed: true },
    });

    // mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // create token (same as signup)
    const token = jwt.sign({ userId: updatedUser.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password: _, ...safeUser } = updatedUser;

    return {
      user: safeUser,
      token,
    };
  }
}

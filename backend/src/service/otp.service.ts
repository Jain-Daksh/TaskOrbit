import { prisma } from '../../prisma/client';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { config } from '../../config/bussiness.Config';

export class OTPService {
  static async sendOTP(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    await prisma.oTP.create({
      data: {
        code,
        expiresAt,
        userId: user.id,
      },
    });

    // Use SMTP config from business config
    const transporter = nodemailer.createTransport({
      host: config.SMTP.HOST,
      port: config.SMTP.PORT,
      auth: {
        user: config.SMTP.USER,
        pass: config.SMTP.PASS,
      },
    });

    await transporter.sendMail({
      from: `"${config.SMTP.FROM_NAME}" <${config.SMTP.FROM_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <h2 style="color: #4CAF50;">Your OTP Code</h2>
          <p>Hi ${user.name || 'there'},</p>
          <p>You requested a One-Time Password (OTP) for your account. Please use the following code to verify your email:</p>
          <p style="font-size: 24px; font-weight: bold; color: #000;">${code}</p>
          <p>This OTP will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      `,
    });

    return { message: 'OTP sent to email' };
  }

  static async verifyOTP(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpRecord) throw new Error('Invalid or expired OTP');

    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return { message: 'User verified successfully' };
  }
}

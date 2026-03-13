import { prisma } from '../../prisma/client';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

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

    // send email (example using nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"MyApp" <no-reply@myapp.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${code}`,
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

    // mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return { message: 'User verified successfully' };
  }
}

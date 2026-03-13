import { prisma } from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/bussiness.Config';

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
}

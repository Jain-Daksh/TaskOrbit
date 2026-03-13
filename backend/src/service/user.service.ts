import { prisma } from '../../prisma/client';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(
    userId: string,
    data: { name?: string; email?: string },
  ) {
    // Check if email is being updated and already exists
    if (data.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== userId)
        throw new Error('Email already in use');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true },
    });

    return updatedUser;
  }

  static async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error('Old password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

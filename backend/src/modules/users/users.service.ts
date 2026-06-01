import { PrismaClient, User } from '@prisma/client';

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async getUserById(id: string): Promise<Omit<User, 'passwordHash' | 'mfaSecret'> | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        lastLoginIp: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getAllUsers(): Promise<Array<Omit<User, 'passwordHash' | 'mfaSecret'>>> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        lastLoginIp: true,
        metadata: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

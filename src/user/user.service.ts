import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PasswordHashHelper } from 'src/helper/hash_password';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByUserName(userName: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        userName: userName,
      },
    });
  }

  async createUser(user: Prisma.UserUncheckedCreateInput) {
    user.password = await PasswordHashHelper.hashPassword(user.password);
    await this.prisma.user.create({
      data: user,
    });
  }
}

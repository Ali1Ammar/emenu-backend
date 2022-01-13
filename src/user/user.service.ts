import { Injectable } from '@nestjs/common';
import { User, Prisma, UserPermissions } from '@prisma/client';
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

  async findById(id: number, selectPassword=false): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        password: selectPassword,
        id: true,
        name: true,
        permissons: true,
        resturantId: true,
        userName: true,
      },
    });
  }

  async enusreHasPermission(id: number[], permission: UserPermissions) {
    const s = await this.prisma.user.updateMany({
      where: {
        id: {
          in: id,
        },

        NOT: {
          permissons: {
            has: permission,
          },
        },
      },
      data: {
        permissons: {
          push: permission,
        },
      },
    });
  }

  async createUser(user: Prisma.UserUncheckedCreateInput) {
    await this.prisma.user.create({
      data: user,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { UserPermissions } from '@prisma/client';
import { RegisterSystemAdminDTO } from 'src/auth/dto/register.dto';
import { PasswordHashHelper } from 'src/helper/hash_password';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // async findByUserName(userName: string): Promise<SystemAdmin> {
  //   return this.prisma.systemAdmin.findUnique({
  //     where: {
  //       userName: userName,
  //     },
  //   });
  // }

  async createDefualtAdmin() {
    await this.userService.createUser({
      name: 'Defualt',
      password: 'admin',
      permissons: [UserPermissions.SystemAdmin],
      userName: 'admin',
      id: 0, //So we can't create other defualt admin by mistake
    });
  }

  async createAdmin(adminDto: RegisterSystemAdminDTO) {
    this.userService.createUser({
      name: adminDto.name,
      password: adminDto.password,
      permissons: [UserPermissions.SystemAdmin],
      userName: adminDto.userName,
    });
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserPermissions } from '@prisma/client';
import { CreateSystemAdminDto, RegisterDTO } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/permission.gurds';
import { DefinedErrors } from 'src/error/error';
import {
  CreateResturantAndAdminDto,
  CreateResturantDto,
} from 'src/resturant/dto/create-resturant.dto';
import { ResturantService } from 'src/resturant/resturant.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(new JwtAuthGuard())
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userSerivice: UserService,

    private resturantService: ResturantService,
  ) {}
  @Post()
  @UseGuards(new PermissionGuard(UserPermissions.SystemAdmin))
  async createAdmin(@Body() body: CreateSystemAdminDto) {
    await this.adminService.createSystemAdmin(body);
  }

  @Post('resturant')
  @UseGuards(new PermissionGuard(UserPermissions.SystemAdmin))
  async createResturant(@Body() body: CreateResturantAndAdminDto) {
    if (!body.adminsId?.length && !body.admin) {
      throw DefinedErrors.wrongInput(
        'please create new admin or links with admin using adminsId',
      );
    }
    await this.resturantService.createResturantAndAdmin(body);
    if (body.adminsId?.length)
      await this.userSerivice.enusreHasPermission(
        body.adminsId,
        UserPermissions.ResturantAdmin,
      );
  }
}

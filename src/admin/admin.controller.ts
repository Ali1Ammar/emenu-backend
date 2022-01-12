import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserPermissions } from '@prisma/client';
import { CreateSystemAdminDto } from 'src/auth/dto/register.dto';
import { PermissionGuard } from 'src/auth/permission.gurds';
import { CreateResturantAndAdminDto, CreateResturantDto } from 'src/resturant/dto/create-resturant.dto';
import { ResturantService } from 'src/resturant/resturant.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private resturantService: ResturantService,
  ) {
    
  }
  @Post()
  @UseGuards(new PermissionGuard(UserPermissions.SystemAdmin))
  async createAdmin(@Body() body: CreateSystemAdminDto) {
    await this.adminService.createSystemAdmin(body);
  }

  @Post('resturant')
  @UseGuards(new PermissionGuard(UserPermissions.SystemAdmin))
  async createResturant(@Body() body: CreateResturantAndAdminDto) {
    await this.resturantService.createResturantAndAdmin(body);
  }
}

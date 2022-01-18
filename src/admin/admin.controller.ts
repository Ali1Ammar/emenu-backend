import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Resturant, UserPermissions } from '@prisma/client';
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
@UseGuards(new JwtAuthGuard(), new PermissionGuard(UserPermissions.SystemAdmin))
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userSerivice: UserService,

    private resturantService: ResturantService,
  ) {}
  @Post()
  async createAdmin(@Body() body: CreateSystemAdminDto) {
    await this.adminService.createSystemAdmin(body);
  }

  @Post('resturant')
  @UseInterceptors(FileInterceptor('img'))
  async createResturant(
    @Body() body: CreateResturantAndAdminDto,
    @UploadedFile() img: Express.Multer.File,
  ): Promise<Resturant> {
    console.log(img, body);
    if (body.adminsId == undefined && !body.admin) {
      throw DefinedErrors.wrongInput(
        'please create new admin or links with admin using adminsId',
      );
    }
    let rest = await this.resturantService.createResturantAndAdmin(
      body,
      img.path,
    );
    if (body.adminsId)
      await this.userSerivice.enusreHasPermission(
        [body.adminsId],
        UserPermissions.ResturantAdmin,
      );
    return rest;
  }

  @Get('resturant')
  async getAllResturantInSystem() {
    return this.resturantService.findAllForAdmin();
  }

  @Get('resturant/:id')
  async getResturantViaId(@Param('id') id: number) {
    return this.resturantService.findById(id);
  }

  @Post('resturant/:id/active/:val')
  activeResturant( @Param("id") id:number , @Param('val') active: boolean) {
    return this.resturantService.acriveResturant(id, active);
  }
}

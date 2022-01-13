import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  CustomerSpot,
  Prisma,
  Resturant,
  UserPermissions,
} from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/permission.gurds';
import { User, UserJwt } from 'src/auth/user.decoration';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { CreateOrderTypeDto } from './dto/create-ordertype.dto';
import { ResturantService } from './resturant.service';
// import { CreateResturantDto } from './dto/create-resturant.dto';
// import { UpdateResturantDto } from './dto/update-resturant.dto';

@Controller('resturant/admin')
@UseGuards(new JwtAuthGuard(),new PermissionGuard(UserPermissions.ResturantAdmin))
export class ResturantAdminController {
  constructor(private readonly resturantService: ResturantService) {}
  @Post('customerSpot')
  async addSpot(@Body() spot: CustomerSpot, @User() user: UserJwt) {
    await this.resturantService.addSpot(user.resturantId, spot);
  }

  @Post('main-category')
  async addMainCategory(
    @Body() data: CreateMainCategoryDto,
    @User() user: UserJwt,
  ) {
    await this.resturantService.addMainCategory(user.resturantId, data);
  }

  @Post('sub-category')
  async addSubCategory(
    @Body() data: CreateSubCategoryDto,
    @User() user: UserJwt,
  ) {
    await this.resturantService.addSubCategory(user.resturantId, data);
  }

  @Post('kitchen')
  async addKitchen(@Body() data: CreateKitchenDto, @User() user: UserJwt) {
    await this.resturantService.addKitchen(user.resturantId, data);
  }

  @Post('order-type')
  async addOrderType(@Body() data: CreateOrderTypeDto, @User() user: UserJwt) {
    await this.resturantService.addOrderType(user.resturantId, data);
  }

  @Post('meal')
  async addMeal(@Body() data: CreateMealDto, @User() user: UserJwt) {
    await this.resturantService.addMeal(user.resturantId, data);
  }
}

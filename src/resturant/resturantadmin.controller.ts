import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Put,
} from '@nestjs/common';
import { CustomerSpot, UserPermissions } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/permission.gurds';
import { Payload, UserJwt } from 'src/auth/payload.decoration';
import { DefinedErrors } from 'src/error/error';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { CreateMealDto, EditMealDto } from './dto/create-meal.dto';
import { CreateOrderTypeDto } from './dto/create-ordertype.dto';
import { ResturantService } from './resturant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasResturantGuard } from './has_resturant.gurad';
import { ImgHelper } from 'src/helper/img';

@Controller('resturantadmin')
@UseGuards(
  new JwtAuthGuard(),
  new PermissionGuard(UserPermissions.ResturantAdmin),
  new HasResturantGuard(),
)
export class ResturantAdminController {
  constructor(private readonly resturantService: ResturantService) {}
  @Post('customerSpot')
  async addSpot(@Body() spot: CustomerSpot, @Payload() user: UserJwt) {
    await this.resturantService.addSpot(user.resturantId, spot);
  }

  @Post('main-category')
  @UseInterceptors(ImgHelper.fileInterceptor())
  async addMainCategory(
    @Body() data: CreateMainCategoryDto,
    @Payload() user: UserJwt,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (typeof data.children == 'string') {
      // when using form data and sent one element this make it recive as string
      data.children = [data.children];
    }
    if(img==undefined){
      throw DefinedErrors.wrongInput('please upload image')
    }
    const path = await ImgHelper.saveCateImg(img);

    await this.resturantService.addMainCategory(
      user.resturantId,
      data,
      path,
    );
  }

  @Post('sub-category')
  async addSubCategory(
    @Body() data: CreateSubCategoryDto,
    @Payload() user: UserJwt,
  ) {
    await this.resturantService.addSubCategory(user.resturantId, data);
  }

  @Post('kitchen')
  async addKitchen(@Body() data: CreateKitchenDto, @Payload() user: UserJwt) {
    await this.resturantService.addKitchen(user.resturantId, data);
  }

  @Post('order-type')
  async addOrderType(
    @Body() data: CreateOrderTypeDto,
    @Payload() user: UserJwt,
  ) {
    await this.resturantService.addOrderType(user.resturantId, data);
  }

  @Post('meal')
  @UseInterceptors(ImgHelper.fileInterceptor())
  async addMeal(
    @Body() data: CreateMealDto,
    @Payload() user: UserJwt,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (typeof data.extra == 'string') {
      // when using form data and sent one element this make it recive as string
      data.extra = [data.extra];
    }
    const meal = await this.resturantService.addMeal(user.resturantId, data);
    const path = await ImgHelper.saveMealImg(img, user.resturantId, meal.id);
    await this.resturantService.editMealImage(meal.id, path);
    meal.img = path;
    return meal;
  }

  @Put('meal/:id')
  @UseInterceptors(ImgHelper.fileInterceptor())
  async editMeal(
    @Body() data: EditMealDto,
    @Param('id') id: number,
    @Payload() user: UserJwt,
    @UploadedFile() img: Express.Multer.File,
  ) {
    if (typeof data.extra == 'string') {
      // when using form data and sent one element this make it recive as string
      data.extra = [data.extra];
    }
    const meal = await this.resturantService.editMeal(
      id,
      user.resturantId,
      data,
    );
    if (img != null) {
      const path = await ImgHelper.saveMealImg(img, user.resturantId, meal.id);
      meal.img = path;
      await this.resturantService.editMealImage(meal.id, path);
    }
    return meal;
  }

  @Get('meal')
  async getLinkedMealResturant(@Payload() user: UserJwt) {
    return this.resturantService.findMealByResturantId(user.resturantId);
  }

  @Get()
  async getLinkedResturant(@Payload() user: UserJwt) {
    return this.resturantService.findById(user.resturantId);
  }

  @Post('/meal/:id/active/:val')
  activeResturant(@Param('val') active: boolean, @Payload() user: UserJwt , @Param("id") id:number ) {
    return this.resturantService.activeMeal(user.resturantId,id, active);
  }


  @Get("/feedback")
  async getFeedback(@Payload() user: UserJwt) {
    return this.resturantService.getFeedback(user.resturantId);
  }
}

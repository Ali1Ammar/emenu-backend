import { Injectable } from '@nestjs/common';
import {
  CustomerSpot,
  Kitchen,
  MainCategory,
  Meal,
  OrderType,
  Prisma,
  Resturant,
  SubCategory,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { CreateOrderTypeDto } from './dto/create-ordertype.dto';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { CreateSpotDto } from './dto/create-spot.dto';

@Injectable()
export class ResturantService {
  constructor(private prisma: PrismaService) {}

  create(createResturantDto: CreateResturantDto): Promise<Resturant> {
    return this.prisma.resturant.create({
      data: {
        ...createResturantDto,
        admins: {
          connect: PrismaHelper.idsToObjects(createResturantDto.adminsId),
        },
      },
    });
  }

  addSpot(resturantId: number, spot: CreateSpotDto): Promise<CustomerSpot> {
    return this.prisma.customerSpot.create({
      data: {
        resturant: {
          connect: {
            id: spot.resturantId,
          },
        },
        note: spot.note,
        orderType: {
          connect: {
            id: 2,
          },
        },
        kitchen: {
          connect: {
            id: spot.kitchenId,
          },
        },
      },
    });
  }

  addKitchen(resturantId: number, kitchen: CreateKitchenDto): Promise<Kitchen> {
    return this.prisma.kitchen.create({
      data: {
        ...kitchen,
        resturantId: resturantId,
      },
    });
  }

  addMainCategory(
    resturantId: number,
    category: CreateMainCategoryDto,
  ): Promise<MainCategory> {
    return this.prisma.mainCategory.create({
      data: {
        ...category,
        resturantId: resturantId,
      },
    });
  }

  async addSubCategory(
    resturantId: number,
    category: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const mainCategory = await this.prisma.mainCategory.findFirst({
      where: {
        id: category.mainCategoryId,
        resturantId: resturantId,
      },
      select: {},
    });
    if (mainCategory == null) this.unAuthrize();
    return this.prisma.subCategory.create({
      data: {
        ...category,
      },
    });
  }

  addOrderType(
    resturantId: number,
    orderType: CreateOrderTypeDto,
  ): Promise<OrderType> {
    return this.prisma.orderType.create({
      data: {
        ...orderType,
        resturantId: resturantId,
      },
    });
  }

  async addMeal(resturantId: number, meal: CreateMealDto): Promise<Meal> {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: {
        id: meal.subCategoryId,
        mainCategory: {
          resturantId: resturantId,
        },
      },
      select: {},
    });
    if (subCategory == null) this.unAuthrize();

    if (meal.kitchenId) {
      const kitchen = await this.prisma.kitchen.findFirst({
        where: {
          id: meal.kitchenId,
          resturantId: resturantId,
        },
        select: {},
      });
      if (kitchen == null) this.unAuthrize();
    }

    return this.prisma.meal.create({
      data: {
        ...meal,
      },
    });
  }

  findAll(isDisabled?: boolean): Promise<Resturant[]> {
    return this.prisma.resturant.findMany({
      where: {
        isDisabled: isDisabled,
      },
    });
  }

  private unAuthrize() {//TODO
    throw 'Only Admin Can edit this';
  }
}

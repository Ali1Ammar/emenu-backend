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
  UserPermissions,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { CreateOrderTypeDto } from './dto/create-ordertype.dto';
import { CreateResturantAndAdminDto } from './dto/create-resturant.dto';
import { CreateSpotDto } from './dto/create-spot.dto';
import { PrismaHelper } from '../helper/prisma_helper';
import { DefinedErrors } from 'src/error/error';
@Injectable()
export class ResturantService {
  constructor(private prisma: PrismaService) {}

  async createResturantAndAdmin(
    dto: CreateResturantAndAdminDto,
    img: string,
  ): Promise<Resturant> {
    let create;
    if (dto.admin) {
      let perm = dto.admin.permissons ?? [];
      if (!perm.includes(UserPermissions.ResturantAdmin)) {
        perm.push(UserPermissions.ResturantAdmin);
      }
      create = dto.admin
        ? {
            ...dto.admin,
            permissons: perm,
          }
        : undefined;
    }

    const connect =
      dto.adminsId != null
        ? {
            id: dto.adminsId,
          }
        : undefined;
    try {
      return await this.prisma.resturant.create({
        data: {
          ...dto.resturant,
          img,
          admins: {
            create,
            connect,
          },
        },
      });
    } catch (e) {
      console.log('e');

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw DefinedErrors.wrongInput(
            'اسم المستخدم هذا مستعمل الرجاء تغيره',
          );
        }
      }

      throw e;
    }
  }

  addSpot(resturantId: number, spot: CreateSpotDto): Promise<CustomerSpot> {
    return this.prisma.customerSpot.create({
      data: {
        resturant: {
          connect: {
            id: resturantId,
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

  findAllForAdmin(): Promise<Resturant[]> {
    return this.prisma.resturant.findMany();
  }

  findAllForClient(): Promise<Resturant[]> {
    return this.prisma.resturant.findMany({
      where: {
        isDisabled: false,
      },
    });
  }

  async findById(id: number): Promise<ResturantRelationDTO> {
    const res = await this.prisma.resturant.findUnique({
      where: {
        id,
      },
      include: {
        Kitchen: true,
        MainCategory: {
          include: {
            children: true,
          },
        },
        customerSpot: true,
        orderType: true,
      },
    });
    return res;
  }

  async findByIdForClient(id: number): Promise<GetResturantClientDto> {
    const res = await this.prisma.resturant.findFirst({
      where: {
        id,
        isDisabled: false,
      },
      include: {
        MainCategory: {
          include: {
            children: {
              include: {
                meals: true,
              },
            },
          },
        },
        orderType: true,
      },
    });
    return res;
  }

  private unAuthrize() {
    //TODO
    throw 'Only Admin Can edit this';
  }
}

type GetResturantClientDto = Resturant & {
  MainCategory: (MainCategory & {
    children: (SubCategory & {
      meals: Meal[];
    })[];
  })[];
  orderType: OrderType[];
};

type ResturantRelationDTO = Resturant & {
  Kitchen: Kitchen[];
  MainCategory: (MainCategory & {
    children: SubCategory[];
  })[];
  customerSpot: CustomerSpot[];
  orderType: OrderType[];
};

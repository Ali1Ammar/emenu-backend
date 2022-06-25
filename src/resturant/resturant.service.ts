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
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import { CreateKitchenDto } from './dto/create-kitchen.dto';
import { CreateMealDto, EditMealDto } from './dto/create-meal.dto';
import { CreateOrderTypeDto } from './dto/create-ordertype.dto';
import { CreateResturantAndAdminDto } from './dto/create-resturant.dto';
import { CreateSpotDto } from './dto/create-spot.dto';
import { DefinedErrors } from 'src/error/error';
import { PasswordHashHelper } from 'src/helper/hash_password';
import { PrismaService } from 'src/prisma.service';
import {
  GetResturantClientDto,
  ResturantRelationDTO,
} from './dto/get-resturant.dto';
import { GetCustomerSpotClientDto } from './dto/get-customerspot.dto';
import { CreateStaffDto, GetStaffDto } from './dto/staff';
@Injectable()
export class ResturantService {
  getFeedback(resturantId: number) {
    return this.prisma.customerFeedBack.findMany({
      where: {
        resturantId: resturantId,
      },
    });
  }
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
      dto.admin.password = await PasswordHashHelper.hashPassword(
        dto.admin.password,
      );
      create = {
        ...dto.admin,
        permissons: perm,
      };
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
        kitchenId: spot.kitchenId,
        resturantId: resturantId,
        identifier: spot.identifier,
        orderTypeId: spot.orderTypeId,
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
    img: string,
  ): Promise<MainCategory> {
    return this.prisma.mainCategory.create({
      data: {
        ...category,
        img,
        resturantId: resturantId,
        children: {
          createMany: {
            data: category.children.map((v) => {
              return { title: v };
            }),
          },
        },
      },
      include: {
        children: true,
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

  async addStaff(
    resturantId: number,
    staff: CreateStaffDto,
  ): Promise<GetStaffDto> {
    try {
      return await this.prisma.user.create({
        data: {
          ...staff,
          password: await PasswordHashHelper.hashPassword(staff.password),
          resturantId: resturantId,
        },
        select: {
          password: false,
          id: true,
          name: true,
          permissons: true,
          userName: true,
          resturantId: true,
        },
      });
    } catch (e) {
      console.log(e);
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

  async deleteStaff(resturantId: number, staffId: number) {
    await this.prisma.user.deleteMany({
      where: {
        id: staffId,
        resturantId: resturantId,
      },
    });
  }

  async deleteOrderType(resturantId: number, id: number) {
    await this.prisma.orderType.deleteMany({
      where: {
        id: id,
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
      select: {
        id: true,
      },
    });
    if (subCategory == null) this.unAuthrize();

    if (meal.kitchenId) {
      const kitchen = await this.prisma.kitchen.findFirst({
        where: {
          id: meal.kitchenId,
          resturantId: resturantId,
        },
        select: { id: true },
      });
      if (kitchen == null) this.unAuthrize();
    }
    return this.prisma.meal.create({
      data: {
        ...meal,
      },
    });
  }

  async editMealImage(mealId: number, img: string) {
    await this.prisma.meal.updateMany({
      where: {
        id: mealId,
      },
      data: {
        img: img,
      },
    });
  }

  async editMeal(
    mealId: number,
    resturantId: number,
    meal: EditMealDto,
  ): Promise<Meal> {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: {
        id: meal.subCategoryId,
        mainCategory: {
          resturantId: resturantId,
        },
      },
      select: {
        id: true,
      },
    });
    if (subCategory == null) this.unAuthrize();

    if (meal.kitchenId) {
      const kitchen = await this.prisma.kitchen.findFirst({
        where: {
          id: meal.kitchenId,
          resturantId: resturantId,
        },
        select: { id: true },
      });
      if (kitchen == null) this.unAuthrize();
    }
    return this.prisma.meal.update({
      where: { id: mealId },
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
        kitchen: true,
        mainCategory: {
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

  async findMealByResturantId(id: number): Promise<Meal[]> {
    const res = await this.prisma.meal.findMany({
      where: {
        kitchen: {
          resturantId: id,
          isDisabled: false,
        },
      },
    });
    return res;
  }

  async findStaffByResturantId(id: number): Promise<GetStaffDto[]> {
    const res = await this.prisma.user.findMany({
      where: {
        resturantId: id,
      },
      select: {
        password: false,
        id: true,
        name: true,
        permissons: true,
        userName: true,
        resturantId: true,
      },
    });
    return res;
  }

  async findMealForCustomer(subCategoryId: number): Promise<Meal[]> {
    const res = await this.prisma.meal.findMany({
      where: {
        subCategoryId: subCategoryId,
        isDisabled: false,
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
        mainCategory: {
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

  async findBySpotIdForClient(id: number): Promise<GetCustomerSpotClientDto> {
    const res = await this.prisma.customerSpot.findFirst({
      where: {
        id,
        isDisabled: false,
      },
      include: {
        orderType: true,
        resturant: {
          include: {
            mainCategory: {
              include: {
                children: {
                  include: {
                    meals: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return {
      spot: res,
      orderType: res.orderType,
      resturant: res.resturant,
    };
  }

  async acriveResturant(id: number, active: boolean) {
    const res = await this.prisma.resturant.update({
      where: {
        id,
      },
      data: {
        isDisabled: active,
      },
    });
    return res;
  }

  async activeMeal(id: number, restId: number, active: boolean) {
    const res = await this.prisma.meal.updateMany({
      where: {
        id,
      },
      data: {
        isDisabled: active,
      },
    });
    console.log(res);
    return res;
  }

  private unAuthrize() {
    //TODO
    throw 'Only Admin Can edit this';
  }
}

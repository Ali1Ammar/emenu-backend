import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CustomerFeedBack,
  CustomerSpot,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentType,
  SelectKitchenVia,
} from '@prisma/client';
import { AppGateway } from 'src/app.gateway';
import { JwtType } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerFeedBackDto } from './dto/create-feedback.dto';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private gateway: AppGateway,
  ) {}

  async createOrder(createDto: CreateOrderDto) {
    const meals = await this.prisma.meal.findMany({
      where: {
        id: {
          in: createDto.orderItems.map((v) => {
            return v.mealId;
          }),
        },
      },
      select: {
        price: true,
        id: true,
        kitchenId: true,
      },
    });

    const price = await this._calcPrice(createDto.orderItems, meals);
    const kitchens = new Set(
      meals.map((v) => {
        return v.kitchenId;
      }),
    );
    const res = await this.prisma.order.create({
      data: {
        status: OrderStatus.WaitPayment, //TODO choice right status
        customerSpotId: createDto.customerSpotId,
        orderTypeId: createDto.orderTypeId,
        price: price,
        kitchenIds: [...kitchens],
        orderItems: {
          createMany: {
            data: createDto.orderItems,
          },
        },
      },
      include: {
        type: true,
        customerSpot: true,
        orderItems: true,
        customerFeedBack: true,
      },
    });
    this._emitToGateway(res);

    return {
      access_token: this.jwtService.sign({
        ...res,
        type: JwtType.order,
      }),
    };
  }

  private _emitToGateway(res: GetOrderRelation) {
    switch (res.type.selectKitchenVia) {
      case SelectKitchenVia.CustomerSpot:
        this.gateway.emitOrder(res.id, res, [res.customerSpot.kitchenId]);
        break;
      case SelectKitchenVia.Meal:
        this.gateway.emitOrder(res.id, res, res.kitchenIds);

        break;
      case SelectKitchenVia.None:
        this.gateway.emitOrder(res.id, res, undefined);
        break;
    }
  }

  async updateStatusByAdmin(
    id: number,
    linkedRestId: number,
    status: OrderStatus,
  ) {
    const batch = await this.prisma.order.updateMany({
      data: {
        status,
      },
      where: {
        id: id,
        customerSpot: {
          resturantId: linkedRestId,
        },
      },
    });
    if (batch.count == 0) {
      throw new UnauthorizedException();
    }
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    this.gateway.emitOrderChange(
      linkedRestId,
      order.kitchenIds,
      order.id,
      status,
    );
  }

  async payed(id: number, linkedRestId: number) {
    const order = await this.getOrderById(id);
    order.type.paymentType;
    let nextStatus: OrderStatus;
    if (order.type.paymentType == PaymentType.beforeTakeOrder) {
      nextStatus = OrderStatus.WaitInKitchen;
    } else if (order.type.paymentType == PaymentType.afterTakeOrder) {
      nextStatus = OrderStatus.Done;
    }
    const batch = await this.prisma.order.updateMany({
      data: {
        isPayed: true,
        status: nextStatus,
      },
      where: {
        id: id,
        customerSpot: {
          resturantId: linkedRestId,
        },
      },
    });
    if (batch.count == 0) {
      throw new UnauthorizedException();
    }
    this.gateway.emitOrderChange(
      linkedRestId,
      order.kitchenIds,
      order.id,
      nextStatus,
      true,
    );
  }

  async getOrderById(id: number): Promise<GetOrderDto> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        type: true,
        customerSpot: true,
      },
    });
  }

  async getCurrentOrderForKitchen(
    kitchenId: number,
  ): Promise<GetOrderRelation[]> {
    return this.prisma.order.findMany({
      where: {
        isPayed: false,
        OR: [
          {
            customerSpot: {
              kitchenId,
            },
          },
          {
            orderItems: {
              some: {
                meal: {
                  kitchenId,
                },
              },
            },
          },
        ],
      },
      include: {
        type: true,
        customerSpot: true,
        orderItems: true,
        customerFeedBack: true,
      },
    });
  }

  async getCurrentOrderForResturant(
    restId: number,
  ): Promise<GetOrderRelation[]> {
    return this.prisma.order.findMany({
      where: {
        customerSpot: {
          resturantId: restId,
        },
      },
      include: {
        type: true,
        customerSpot: true,
        orderItems: true,
        customerFeedBack: true,
      },
    });
  }

  async addCustomerFeedbackAndMarkAsDone(
    id: number,
    feedback: CreateCustomerFeedBackDto,
  ) {
    await this.prisma.order.update({
      data: {
        customerFeedBack: feedback
          ? {
              create: feedback,
            }
          : undefined,
        status: OrderStatus.Done,
      },
      where: {
        id: id,
      },
    });
  }

  private async _calcPrice(orderItems: CreateOrderItemDto[], meals) {
    if (meals.length != orderItems.length) {
      //TODO
    }
    const priceMap = {};
    for (const iterator of meals) {
      priceMap[iterator.id] = {
        price: iterator.price,
      };
    }
    let price = 0;
    for (const iterator of orderItems) {
      price += priceMap[iterator.mealId]['price'] * iterator.count;
    }
    if (price == 0) {
      //TODO
    }
    return price;
  }
}

export type GetOrderDto = Order & {
  customerSpot: CustomerSpot;
  type: OrderType;
};

export type GetOrderRelation = Order & {
  orderItems: OrderItem[];
  customerSpot: CustomerSpot;
  customerFeedBack: CustomerFeedBack;
  type: OrderType;
};

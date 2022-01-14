import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CustomerSpot,
  Order,
  OrderStatus,
  OrderType,
  PaymentType,
} from '@prisma/client';
import { JwtType } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerFeedBackDto } from './dto/create-feedback.dto';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async createOrder(createDto: CreateOrderDto) {
    const price = await this._calcPrice(createDto.orderItems);
    const res = await this.prisma.order.create({
      data: {
        status: OrderStatus.WaitPayment, //TODO choice right status
        customerSpotId: createDto.customerSpotId,
        orderTypeId: createDto.orderTypeId,
        price: price,
        orderItems: {
          createMany: {
            data: createDto.orderItems,
          },
        },
      },
    });

    return {
      access_token: this.jwtService.sign({
        ...res,
        type: JwtType.order,
      }),
    };
  }

  async updateStatus(id: number, status: OrderStatus) {
    await this.prisma.order.update({
      data: {
        status,
      },
      where: {
        id: id,
      },
    });
  }

  async payed(id: number) {
    const order = await this.getOrderById(id);
    order.type.paymentType;
    let nextStatus: OrderStatus;
    if (order.type.paymentType == PaymentType.beforeTakeOrder) {
      nextStatus = OrderStatus.WaitInKitchen;
    } else if (order.type.paymentType == PaymentType.afterTakeOrder) {
      nextStatus = OrderStatus.Done;
    }
    await this.prisma.order.update({
      data: {
        isPayed: true,
        status: nextStatus,
      },
      where: {
        id: id,
      },
    });
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

  private async _calcPrice(orderItems: CreateOrderItemDto[]) {
    const meals = await this.prisma.meal.findMany({
      where: {
        id: {
          in: orderItems.map((v) => {
            return v.mealId;
          }),
        },
      },
      select: {
        price: true,
        id: true,
      },
    });
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

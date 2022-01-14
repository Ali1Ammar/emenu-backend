import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerFeedBackDto } from './dto/create-feedback.dto';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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

  async addCustomerFeedback(id: number, feedback: CreateCustomerFeedBackDto) {
    await this.prisma.order.update({
      data: {
        customerFeedBack: {
          create: feedback,
        },
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

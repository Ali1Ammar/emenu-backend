import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CustomerFeedBack,
  CustomerSpot,
  Meal,
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
import { CreateCustomerFeedBack } from './dto/create-feedback.dto';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => AppGateway))
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
    const orderType = await this.prisma.orderType.findUnique({
      where: { id: createDto.orderTypeId },
    });
    const res = await this.prisma.order.create({
      data: {
        status:
          orderType.paymentType == 'beforeTakeOrder'
            ? OrderStatus.WaitPayment
            : OrderStatus.WaitInKitchen,
        customerSpotId: createDto.customerSpotId,
        orderTypeId: createDto.orderTypeId,
        price: price,
        kitchenIds: [...kitchens],
        orderItems: {
          createMany: {
            data: createDto.orderItems,
          },
        },
        resturantId: orderType.resturantId,
      },
      include: {
        type: true,
        customerSpot: true,
        orderItems: {
          include: {
            meal: true,
          },
        },
        customerFeedBack: true,
      },
    });
    this._emitToGateway(res);

    return {
      access_token: this.jwtService.sign({
        id: res.id,
        price: res.price,
        type: JwtType.order,
      }),
      order: res,
    };
  }

  private _emitToGateway(order: GetOrderRelation) {
    const restId = order.type.resturantId;
    switch (order.type.selectKitchenVia) {
      case SelectKitchenVia.CustomerSpot:
        this.gateway.emitOrder(restId, order, [order.customerSpot.kitchenId]);
        break;
      case SelectKitchenVia.Meal:
        this.gateway.emitOrder(restId, order, order.kitchenIds);

        break;
      case SelectKitchenVia.None:
        this.gateway.emitOrder(restId, order, undefined);
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
        type: {
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
    let nextStatus: OrderStatus;
    if (order.type.paymentType == PaymentType.beforeTakeOrder) {
      nextStatus = OrderStatus.WaitInKitchen;
    } else if (order.type.paymentType == PaymentType.afterTakeOrder) {
      nextStatus = OrderStatus.Done;
    }
    console.log(nextStatus);
    const batch = await this.prisma.order.updateMany({
      data: {
        isPayed: true,
        status: nextStatus,
      },
      where: {
        id: id,
        resturantId: linkedRestId,
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
        status: {
          notIn: [OrderStatus.Done, OrderStatus.Canceled],
        },
        kitchenIds: {
          has: kitchenId,
        },
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        type: true,
        customerSpot: true,
        orderItems: {
          include: {
            meal: true,
          },
        },
        customerFeedBack: true,
      },
    });
  }

  async getCurrentOrderForResturant(
    restId: number,
  ): Promise<GetOrderRelation[]> {
    return this.prisma.order.findMany({
      where: {
        resturantId: restId,
        status: {
          notIn: [OrderStatus.Done, OrderStatus.Canceled],
        },
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        type: true,
        customerSpot: true,
        orderItems: {
          include: {
            meal: true,
          },
        },
        customerFeedBack: true,
      },
    });
  }

  async addCustomerFeedbackAndMarkAsDone(
    id: number,
    feedback: CreateCustomerFeedBack,
  ): Promise<CustomerFeedBack> {
    const order = await this.prisma.order.update({
      data: {
        status: OrderStatus.Done,
      },
      where: {
        id: id,
      },
    });
    this.gateway.emitOrderChange(
      order.resturantId,
      order.kitchenIds,
      order.id,
      OrderStatus.Done,
    );
    if (feedback != null) {
      console.log('createing');
      return this.prisma.customerFeedBack.create({
        data: {
          orderId: id,
          resturantId: order.resturantId,
          ...feedback,
        },
      });
    }
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
  orderItems: (OrderItem & {
    meal: Meal;
  })[];
  customerSpot: CustomerSpot;
  customerFeedBack: CustomerFeedBack;
  type: OrderType;
};

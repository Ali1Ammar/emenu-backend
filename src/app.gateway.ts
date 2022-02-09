import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { forwardRef, Inject, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtType } from 'src/auth/jwt-auth.guard';
import { OrderJwt, UserJwt } from 'src/auth/payload.decoration';
import { GetOrderDto, GetOrderRelation, OrderService } from './order/order.service';
import { OrderStatus } from '@prisma/client';
import { socketAuthMiddleware } from './auth/socket.auth.middleware';

@WebSocketGateway({
  transports: ['websocket'],
})
export class AppGateway implements OnApplicationBootstrap {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService
  ) {}
  onApplicationBootstrap() {
    this.server.use((socket, next) =>
      socketAuthMiddleware(socket, next, this.jwtService, this.userService),
    );
  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('subsribeToResturnatOrder')
  async cacher(client: Socket): Promise<any> {
    let user = client.data.payload as UserJwt;
    const key = `ResturnatOrder-${user.resturantId}`;
    const orders = await this.orderService.getCurrentOrderForResturant(user.resturantId);
    await client.join(key);
    return orders;
  }
  

  @SubscribeMessage('subsribeToResturnatKitchenOrder')
  async kitchen(client: Socket, kitchenId: number): Promise<any> {
    this.logger.log('subsribeToResturnatKitchenOrder ' + kitchenId);

    let user = client.data.payload as UserJwt;

    const key = `ResturnatKitchenOrder-${user.resturantId}-${kitchenId}`; //TODO check if kitchen belongs to same resturant
    const orders = await this.orderService.getCurrentOrderForKitchen(kitchenId);

    await client.join(key);
    return orders;
  }

  @SubscribeMessage('CustomerOrder')
  async customerOrder(client: Socket): Promise<any> {
    this.logger.log('CustomerOrder called');
    let order = client.data.payload;
    if (order?.type != JwtType.order)
      return 'please provide authorization token for customer order';
    const key = `CustomerOrder-${order.id}`;
    await client.join(key);
    return `Done will be emit at ${key}`;
  }

  emitOrder(resturantId: number, order: GetOrderRelation, kitchenId: number[]) {
    this.logger.log(
      `create new order kitchenId=${kitchenId} resturantId=${resturantId}`,
    );
    this.emitToRestAndKitchen(resturantId, kitchenId, 'order', order);
  }

  private emitToRestAndKitchen(
    resturantId: number,
    kitchenId: number[],
    key,
    value,
  ) {
    this.server.to(`ResturnatOrder-${resturantId}`).emit(key, value);
    if (kitchenId)
      kitchenId.forEach((v) => {
        this.server
          .to(`ResturnatKitchenOrder-${resturantId}-${v}`)
          .emit(key, value);
      });
  }

  emitOrderChange(
    resturantId: number,
    kitchenId: number[],
    orderId: number,
    status?: OrderStatus,
    isPayed?: boolean,
  ) {
    const change = {
      id: orderId,
      status,
      isPayed,
    };
    this.emitToRestAndKitchen(resturantId, kitchenId, 'order-change', change);
    this.server.to(`CustomerOrder-${orderId}`).emit('order-change', change);
  }
}

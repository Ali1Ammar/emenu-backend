import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtType } from 'src/auth/jwt-auth.guard';
import { OrderJwt, UserJwt } from 'src/auth/payload.decoration';
import { GetOrderDto, GetOrderRelation } from './order/order.service';
import { OrderStatus } from '@prisma/client';

@WebSocketGateway({
  transports: ['websocket'],
})
export class AppGateway implements OnGatewayConnection, OnApplicationBootstrap {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  onApplicationBootstrap() {
    this.server.use(async (socket, next) => {
      const error = new Error(
        'please provide authorization token for admin user has resturantId',
      );
      this.logger.log('use middleware auth');
      const token = socket.handshake.headers.authorization;
      if (!token) {
        return next(error);
      }

      const payload = this.jwtService.verify(token);
      if (!payload) {
        return next(error);
      }
      if (payload.type == JwtType.login) {
        const user = await this.userService.findById(payload.id);
        if (!user?.resturantId) {
          return next(error);
        }

        socket.data['payload'] = user;
      } else if (payload.type == JwtType.order) {
        socket.data['payload'] = payload;
      }
      next();
    });
  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('subsribeToResturnatOrder')
  async cacher(client: Socket): Promise<any> {
    this.logger.log('subsribeToResturnatOrder');

    let user = client.data.payload as UserJwt;

    const key = `ResturnatOrder-${user.resturantId}`;
    await client.join(key);
    this.logger.log(`subsribeToResturnatOrder done ${key}`);

    return 'Done';
  }

  @SubscribeMessage('subsribeToResturnatKitchenOrder')
  async kitchen(client: Socket, kitchenId: number): Promise<any> {
    this.logger.log('subsribeToResturnatKitchenOrder ' + kitchenId);

    let user = client.data.payload as UserJwt;
    if (!user?.resturantId)
      return 'please provide authorization token for admin user has resturantId';
    const key = `ResturnatKitchenOrder-${user.resturantId}-${kitchenId}`; //TODO check if kitchen belongs to same resturant
    await client.join(key);
    return 'Done';
  }

  @SubscribeMessage('CustomerOrder')
  async customerOrder(client: Socket): Promise<any> {
    this.logger.log('CustomerOrder called');
    let order = client.data.payload;
    if (order?.type || order!.type != JwtType.order)
      return 'please provide authorization token for customer order';
    const key = `CustomerOrder-${order.id}`;
    await client.join(key);
    return `Done will be emit at ${key}`;
  }

  async handleConnection(client: Socket, req: Request) {
    this.logger.log('user conntect');
    // const token = client.handshake.headers.authorization;
    // if (!token) {
    //   return this.disconntectClient(client);
    // }

    // const payload = this.jwtService.verify(token);
    // if (!payload) {
    //   return this.disconntectClient(client);
    // }
    // if (payload.type == JwtType.login) {
    //   const user = await this.userService.findById(payload.id);
    //   if (!user?.resturantId) {
    //     return this.disconntectClient(client);
    //   }
    //   // console.log();
    //   client.data['payload'] = user;
    // } else if (payload.type == JwtType.order) {
    //   client.data['payload'] = payload;
    // }
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

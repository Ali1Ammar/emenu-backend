import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtType } from 'src/auth/jwt-auth.guard';
import { OrderJwt, UserJwt } from 'src/auth/payload.decoration';
import { GetOrderDto } from './order/order.service';
import { OrderStatus } from '@prisma/client';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subsribeToResturnatOrder')
  async cacher(client: Socket): Promise<void> {
    let user = client.data.payload as UserJwt;
    if (!user?.resturantId)
      client.send(
        'please provide authorization token for admin user has resturantId',
      );
    const key = `ResturnatOrder-${user.resturantId}`;
    await client.join(key);
    client.send(`Done will be emit at ${key}`, key);
  }

  @SubscribeMessage('subsribeToResturnatKitchenOrder')
  async kitchen(client: Socket, kitchenId: number): Promise<void> {
    let user = client.data.payload as UserJwt;
    if (!user?.resturantId)
      client.send(
        'please provide authorization token for admin user has resturantId',
      );
    const key = `ResturnatKitchenOrder-${user.resturantId}-${kitchenId}`; //TODO check if kitchen belongs to same resturant
    await client.join(key);
    client.send(`Done will be emit at ${key}`, key);
  }

  @SubscribeMessage('CustomerOrder')
  async customerOrder(client: Socket): Promise<void> {
    let order = client.data.payload;
    if (order?.type || order!.type != JwtType.order)
      client.send('please provide authorization token for customer order');
    const key = `CustomerOrder-${order.id}`;
    await client.join(key);
    client.send(`Done will be emit at ${key}`, key);
  }

  handleConnection(client: Socket, req: Request) {
    const token = client.handshake.headers.authorization;

    const payload = this.jwtService.verify(token);
    if (!payload) client.disconnect();
    if (payload.type == JwtType.login) {
      const user = this.userService.findById(payload.id);
      client.data['payload'] = user;
    } else if (payload.type == JwtType.order) {
      client.data['payload'] = payload;
    }
  }

  emitOrder(resturantId: number, order: GetOrderDto, kitchenId: number[]) {
    this.server.to(`ResturnatOrder-${resturantId}`).emit('order', order);
    if (kitchenId)
      kitchenId.forEach((v) => {
        this.server
          .to(`ResturnatKitchenOrder-${resturantId}-${v}`)
          .emit('order', order);
      });
  }

  emitOrderStatusChangeToCustomer(orderId: number, status: OrderStatus) {
    this.server.to(`CustomerOrder-${orderId}`).emit('order-change', status);
  }
}

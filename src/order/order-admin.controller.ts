import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { OrderStatus, UserPermissions } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/permission.gurds';
import { OrderService } from './order.service';
//TODO here we need extra validation for checking if this order belongs to this user
//TODO need work wuth a websocket so we return this to the customer
@Controller('order/admin')
@UseGuards(new JwtAuthGuard())
export class OrderAdminController {
  constructor(private orderService: OrderService) {}
  
  @Post('pay/:orderId')
  @UseGuards(
    new PermissionGuard(UserPermissions.ResturantAdmin, UserPermissions.Cacher),
  )
  customerPayToCasher(@Param('orderId') orderId: number) {
    return this.orderService.payed(orderId);
  }

  @Post('cooked/:orderId')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  kitchenDoneCook(@Param('orderId') orderId: number) {
    return this.orderService.updateStatus(orderId, OrderStatus.DoneByKitchen);
  }

  @Post('deliver/:orderId')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  kitchenDeliver(@Param('orderId') orderId: number) {
    return this.orderService.updateStatus(
      orderId,
      OrderStatus.DeliveredByKitchen,
    );
  }

  @Post('cancel/:orderId')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
      UserPermissions.Cacher,

    ),
  )
  cancelOrder(@Param('orderId') orderId: number,@Body('msg') msg: string) {
      //TODO return msg to user
    return this.orderService.updateStatus(
      orderId,
      OrderStatus.Canceled,
    );
  }
}

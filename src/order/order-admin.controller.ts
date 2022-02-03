import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderStatus, UserPermissions } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Payload, UserJwt } from 'src/auth/payload.decoration';
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
  customerPayToCasher(
    @Param('orderId') orderId: number,
    @Payload() user: UserJwt,
  ) {
    return this.orderService.payed(orderId, user.resturantId);
  }

  @Get('kitchen/:kitchenId/current')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  currentOrderForKitchen(@Param('kitchenId') kitchenId:number,@Payload() user) {
    console.log(user);
    return this.orderService.getCurrentOrderForKitchen(kitchenId);
  }

  @Get('current')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  currentOrder(@Payload() user: UserJwt) {
    return this.orderService.getCurrentOrderForResturant(user.resturantId!);
  }

  @Post('cooked/:orderId')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  kitchenDoneCook(@Param('orderId') orderId: number, @Payload() user: UserJwt) {
    return this.orderService.updateStatusByAdmin(
      orderId,
      user.resturantId,
      OrderStatus.DoneByKitchen,
    );
  }

  @Post('deliver/:orderId')
  @UseGuards(
    new PermissionGuard(
      UserPermissions.ResturantAdmin,
      UserPermissions.Kitchen,
    ),
  )
  kitchenDeliver(@Param('orderId') orderId: number, @Payload() user: UserJwt) {
    return this.orderService.updateStatusByAdmin(
      orderId,
      user.resturantId,
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
  cancelOrder(
    @Param('orderId') orderId: number,
    @Body('msg') msg: string,
    @Payload() user: UserJwt,
  ) {
    //TODO return msg to user
    return this.orderService.updateStatusByAdmin(
      orderId,
      user.resturantId,
      OrderStatus.Canceled,
    );
  }
}

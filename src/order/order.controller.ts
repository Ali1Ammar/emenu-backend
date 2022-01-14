import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard, OrderJwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderJwt, Payload } from 'src/auth/payload.decoration';
import { CreateCustomerFeedBackDto } from './dto/create-feedback.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }

  @Post('done')
  @UseGuards(new OrderJwtAuthGuard())
  userComplete(
    @Body() body: CreateCustomerFeedBackDto | null,
    @Payload() order: OrderJwt,
  ) {
    return this.orderService.addCustomerFeedbackAndMarkAsDone(order.id, body);
  }  
}
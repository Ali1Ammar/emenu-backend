import { Module } from '@nestjs/common';
import { OrderAdminController } from './order-admin.controller';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderAdminController,OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { ResturantModule } from './resturant/resturant.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { OurConfigService } from './config.service';
import { GlobalModule } from './global.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ GlobalModule , ResturantModule, AdminModule, AuthModule, UserModule, OrderModule],
})
export class AppModule {}

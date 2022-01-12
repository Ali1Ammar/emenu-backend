import { Module } from '@nestjs/common';
import { ResturantModule } from './resturant/resturant.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { OurConfigService } from './config.service';
import { GlobalModule } from './global.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ GlobalModule , ResturantModule, AdminModule, AuthModule, UserModule],
})
export class AppModule {}

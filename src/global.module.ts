import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import configuration, { OurConfigService } from './config.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    JwtModule.registerAsync({
      useFactory: async (configService: OurConfigService) => ({
        secret: configService.getConfig().jwtSecrent,
        signOptions: { expiresIn: '3d' },
      }),
      inject: [OurConfigService],
    }),
    UserModule
  ],
  providers: [OurConfigService, PrismaService, AppGateway],
  exports: [OurConfigService, PrismaService, AppGateway,JwtModule],
})
export class GlobalModule {}

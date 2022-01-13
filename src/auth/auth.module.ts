import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/admin/admin.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { OurConfigService } from 'src/config.service';
import { UserModule } from 'src/user/user.module';
import { ResturantModule } from 'src/resturant/resturant.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    ResturantModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: OurConfigService) => ({
        secret: configService.getConfig().jwtSecrent,
        signOptions: { expiresIn: '7d' },
      }),
      inject: [OurConfigService],
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers:[AuthController]
})
export class AuthModule {}

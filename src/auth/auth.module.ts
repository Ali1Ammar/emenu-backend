import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/admin/admin.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { OurConfigService } from 'src/config.service';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: OurConfigService) => ({
        secret:  configService.getConfig().jwtSecrent,
        signOptions: { expiresIn: '7d' },

      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

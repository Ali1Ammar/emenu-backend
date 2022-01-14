import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import configuration, { OurConfigService } from './config.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [OurConfigService,PrismaService,AppGateway],
  exports: [OurConfigService,PrismaService,AppGateway],
})
export class GlobalModule {}

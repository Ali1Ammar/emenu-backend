import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { OurConfigService } from './config.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [OurConfigService,PrismaService],
  exports: [OurConfigService,PrismaService],
})
export class GlobalModule {}

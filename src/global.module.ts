import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { OurConfigService } from './config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [OurConfigService],
  exports: [OurConfigService],
})
export class GlobalModule {}

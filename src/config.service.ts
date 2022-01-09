import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OurConfigService {
  constructor(public service: ConfigService) {}

   getConfig(): Config {
    return;
  }
}

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  jwtSecrent: process.env.jwtSecrent,
});

interface Config {
  port: number;
  jwtSecrent: string;
}

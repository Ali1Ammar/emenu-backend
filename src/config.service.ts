import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OurConfigService {
  constructor(public service: ConfigService) {}

   getConfig(): Config {
    return this.service.get("all");
  }
}

export default () => ({
  "all" : {
    port: parseInt(process.env.PORT) || 3000,
    jwtSecrent: process.env.jwtSecrent,
  }
});

interface Config {
  port: number;
  jwtSecrent: string;
}

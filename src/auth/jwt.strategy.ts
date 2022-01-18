import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OurConfigService } from 'src/config.service';
import { UserService } from 'src/user/user.service';
import { JwtType } from './jwt-auth.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: OurConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getConfig().jwtSecrent,
    });
  }

  async validate(payload) {
    if (payload.type != JwtType.login) {
      throw ''; //TODO
    }
    const user = await this.userService.findById(payload.id);
    delete user.password;
    return user;
  }
}

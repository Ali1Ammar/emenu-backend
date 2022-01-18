import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Payload, UserJwt } from './payload.decoration';
import { PermissionGuard } from './permission.gurds';

@Controller()
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('login')
    login(@Body() login:LoginDto){
        return this.authService.login(login);
    }

    @Post('recreate')
    @UseGuards(new JwtAuthGuard())
    reCreate(@Payload() user:UserJwt){
        return this.authService.reCreateJwtById(user.id);
    }

}

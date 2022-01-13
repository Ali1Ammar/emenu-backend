import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { DefinedErrors } from 'src/error/error';
import { PasswordHashHelper } from 'src/helper/hash_password';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByUserName(loginDto.username);
    if (!user) throw  DefinedErrors.UserNotFound ; 
    const isMatch = await PasswordHashHelper.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) throw DefinedErrors.WrongPassword;
    delete user.password;
    return {
      access_token: this.jwtService.sign(user),
    };
  }


  // async registerNewAdmin(registerDto:RegisterSystemAdminDTO){
  //   this.adminService.createDefualtAdmin
  // }
}

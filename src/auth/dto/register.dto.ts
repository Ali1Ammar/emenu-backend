import { UserPermissions } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDTO   {
  @IsString()
  userName: string;
  @IsString()
  name: string;
  @IsArray()
  @IsOptional()
  permissons?: UserPermissions[];
  @IsString()
  @IsOptional()
  resturantId?: number;
  @MinLength(6)
  password: string;
}


export class CreateSystemAdminDto   {
  userName: string;
  name: string;
  @MinLength(6)
  password: string;
}

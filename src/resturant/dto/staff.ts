import { UserPermissions } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStaffDto   {
    @IsString()
    userName: string;
    @IsString()
    name: string;
    @IsArray()
    permissons: UserPermissions[];
    @MinLength(6)
    password: string;
  }



export class GetStaffDto   {
    userName: string;
    name: string;
    permissons: UserPermissions[];
    resturantId:number
  }
import { UserPermissions } from '@prisma/client';
import { MinLength } from 'class-validator';

export class RegisterDTO   {
  userName: string;
  name: string;
  permissons: UserPermissions[];
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

import { UserPermissions } from '@prisma/client';

export class RegisterDTO {
  userName: string;
  name: string;
  password: string;
  permissons: UserPermissions[];
  resturantId?: number;
}


export class RegisterSystemAdminDTO {
  userName: string;
  name: string;
  password: string;
}

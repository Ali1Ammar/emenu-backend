import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserPermissions } from '@prisma/client';

@Injectable()
export class PermissionGuard implements CanActivate {
  arg: UserPermissions[];
  constructor(...arg: UserPermissions[]) {
    this.arg = arg;
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userPermissons: UserPermissions[] = request?.user?.permissons;
    if (!userPermissons) return false;
    return checker(userPermissons,this.arg);
  }
}

let checker = <T>(arr:T[], target:T[]) => target.some((v) => arr.includes(v));

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class HasResturantGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log("HasResturantGuard work")
    return request?.user?.resturantId != undefined;
  }
}
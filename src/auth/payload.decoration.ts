import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {  UserPermissions } from '@prisma/client';

export const Payload = createParamDecorator<ExecutionContext>(
  (data: unknown,ctx: ExecutionContext) => {
    return extractUserFromCtx(ctx);
  },
);

export function extractUserFromCtx(ctx: ExecutionContext){
  return ctx.switchToHttp().getRequest().user;
}

export type UserJwt = {
  id: number;
  userName: string;
  name: string;
  permissons: UserPermissions[];
  resturantId?: number;
};

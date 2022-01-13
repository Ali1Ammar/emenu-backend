import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserPrisma, Prisma, UserPermissions } from '@prisma/client';

export const User = createParamDecorator<ExecutionContext>(
  (data: unknown,ctx: ExecutionContext) => {
    return extractUserFromCtx(ctx);
  },
);

export function extractUserFromCtx(ctx: ExecutionContext): UserJwt {
  return ctx.switchToHttp().getRequest().user;
}

export type UserJwt = {
  id: number;
  userName: string;
  name: string;
  permissons: UserPermissions[];
  resturantId?: number;
};

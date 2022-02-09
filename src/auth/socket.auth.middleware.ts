import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { UserService } from 'src/user/user.service';
import { JwtType } from './jwt-auth.guard';

export const socketAuthMiddleware = async (
  socket:Socket,
  next:(err?: ExtendedError) => void,
  jwtService: JwtService,
  userService: UserService,
) => {
  const error = new Error(
    'please provide authorization token for admin user has resturantId',
  );
  const token = socket.handshake.headers.authorization;
  if (!token) {
    return next(error);
  }

  const payload = jwtService.verify(token);
  if (!payload) {
    return next(error);
  }
  if (payload.type == JwtType.login) {
    const user = await userService.findById(payload.id);
    if (!user?.resturantId) {
      return next(error);
    }

    socket.data['payload'] = user;
  } else if (payload.type == JwtType.order) {
    socket.data['payload'] = payload;
  }
  next();
};

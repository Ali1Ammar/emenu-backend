import { Module } from '@nestjs/common';
import { ResturantModule } from './resturant/resturant.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GlobalModule } from './global.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { join } from 'path';


@Module({
  imports: [
    GlobalModule,
    ResturantModule,
    AdminModule,
    AuthModule,
    UserModule,
    OrderModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploaded') ,
    //   // renderPath:"uploaded"
    // })
  ],
})
export class AppModule {}

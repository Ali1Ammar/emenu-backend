import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppGateway } from './app.gateway';
import configuration, { OurConfigService } from './config.service';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: 'uploaded',
    //     filename:(req,file,cb)=>{
    //       // req.
    //       const randomName =randomUUID();
    //       //Calling the callback passing the random name generated with the original extension name
    //       cb(null, `${randomName}${extname(file.originalname)}`);
    //     }
    //     // filename: editFileName,
    //   }),
    // }),
    ConfigModule.forRoot({ load: [configuration] }),
    JwtModule.registerAsync({
      useFactory: async (configService: OurConfigService) => ({
        secret: configService.getConfig().jwtSecrent,
        signOptions: { expiresIn: '3d' },
      }),
      inject: [OurConfigService],
    }),
    UserModule,
    OrderModule
  ],
  providers: [OurConfigService, PrismaService, AppGateway],
  exports: [OurConfigService, PrismaService, AppGateway,JwtModule],
})
export class GlobalModule {}

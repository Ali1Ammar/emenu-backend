
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PasswordHashHelper } from './helper/hash_password';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
    // this.$use(async (params, next) => {
    //   if (params.action == 'create' && params.model == 'User') {
    //     const user = params.args.data;
    //     const hash = await PasswordHashHelper.hashPassword(user.password);
    //     user.password = hash;
    //     params.args.data = user;
    //   }
    //   return next(params);
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });    
  }
}

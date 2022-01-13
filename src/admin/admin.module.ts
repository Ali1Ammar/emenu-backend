import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { ResturantModule } from 'src/resturant/resturant.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports:[UserModule,ResturantModule]
})
export class AdminModule  implements OnApplicationBootstrap {
  constructor(private service :AdminService){}
  onApplicationBootstrap() {
    this.service.createDefualtAdmin();
  }
  
}

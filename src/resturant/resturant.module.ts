import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';
import { ResturantAdminController } from './resturantadmin.controller';

@Module({
  controllers: [ResturantController,ResturantAdminController],
  providers: [ResturantService],
  exports:[ResturantService]
})
export class ResturantModule {}

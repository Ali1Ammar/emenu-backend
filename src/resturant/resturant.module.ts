import { Module } from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { ResturantController } from './resturant.controller';

@Module({
  controllers: [ResturantController],
  providers: [ResturantService],
  exports:[ResturantService]
})
export class ResturantModule {}

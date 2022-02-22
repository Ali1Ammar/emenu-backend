import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Prisma , Resturant } from '@prisma/client';
import { ResturantService } from './resturant.service';
// import { CreateResturantDto } from './dto/create-resturant.dto';
// import { UpdateResturantDto } from './dto/update-resturant.dto';

@Controller('resturant')
export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {}
   
  @Get()
  getResturants(){
    return this.resturantService.findAllForClient();
  }

  // @Get(':id/order-type')
  // getResturantOrderType(@Param('id') id : number){
  //   return this.resturantService.findByIdForClient(id);
  // }

  @Get('meal/:subCategoryId')
  getMeals(@Param('subCategoryId') subCategoryId : number ){
    return this.resturantService.findMealForCustomer(subCategoryId);
  }

 
  @Get(':id')
  getResturantInfo(@Param('id') id : number){
    return this.resturantService.findByIdForClient(id);
  }
}

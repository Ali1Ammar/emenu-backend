import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Prisma , Resturant } from '@prisma/client';
import { ResturantService } from './resturant.service';
// import { CreateResturantDto } from './dto/create-resturant.dto';
// import { UpdateResturantDto } from './dto/update-resturant.dto';

@Controller('resturant')
export class ResturantController {
  constructor(private readonly resturantService: ResturantService) {}

  @Post()
  create(@Body() createResturantDto: CreateResturantDto) {
    return this.resturantService.create();
  }

  @Get()
  findAll() {
    return this.resturantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resturantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResturantDto: UpdateResturantDto) {
    return this.resturantService.update(+id, updateResturantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resturantService.remove(+id);
  }
}

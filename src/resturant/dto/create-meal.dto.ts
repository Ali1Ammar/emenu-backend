import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  title: string;
  @IsString()
  desc: string;

  @Type((_)=>Number)
  @IsNumber()
  price: number;

  @IsNumber()
  @Type((_)=>Number)
  subCategoryId: number;
  
  @IsOptional()
  @Type((_)=>Number)
  @IsNumber()
  kitchenId?: number;
}

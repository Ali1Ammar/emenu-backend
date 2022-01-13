import { IsNumber, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  title: string;
  @IsString()
  desc: string;
  @IsString()
  img: string;
  @IsNumber()
  price: number;
  @IsNumber()
  subCategoryId: number;
  @IsNumber()
  kitchenId?: number;
}

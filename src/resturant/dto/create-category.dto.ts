import { IsArray, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateMainCategoryDto {
  @IsString()
  title: string;
  @IsString()
  desc: string;
  @IsNotEmpty()
  children : string[]
  // @IsUrl()
  // img: string;
}

export class CreateSubCategoryDto {
  @IsString()
  title: string;
  // @IsUrl()
  // img: string;
  @IsNumber()
  mainCategoryId: number;
}

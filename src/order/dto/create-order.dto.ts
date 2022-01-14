import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray({
    each: true,
  })
  @MinLength(1)
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
  @IsNumber()
  customerSpotId: number;
  @IsNumber()
  orderTypeId: number;
}

export class CreateOrderItemDto {
  @IsNumber()
  count: number;
  @IsNumber()
  mealId: number;
  @IsOptional()
  @IsString()
  notes: string;
}

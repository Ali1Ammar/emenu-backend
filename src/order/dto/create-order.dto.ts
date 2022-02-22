import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray({})
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @IsOptional()
  @IsNumber()
  customerSpotId?: number;
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
  @IsArray()
  selectedExtra : string[]
}
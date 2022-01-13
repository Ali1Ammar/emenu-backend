import { OrderType, Prisma } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSpotDto {
  @IsOptional()
  @IsString()
  note?: string;
  @IsOptional()
  @IsNumber()
  kitchenId?: number;
  @IsOptional()
  @IsArray()
  orderTypeIds?: number[];
}

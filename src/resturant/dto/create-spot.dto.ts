import { OrderType, Prisma } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSpotDto {
  @IsString()
  identifier: string;

  @IsOptional()
  @IsNumber()
  kitchenId?: number;
  
  @IsNumber()
  orderTypeId: number;
}

import { DeliverType, OrderType, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

export class CreateOrderTypeDto {
  @IsString()
  name: string;
  @IsString()
  paymentMsg: string;
  @IsString()
  deliverMsg: string;
  @IsEnum(PaymentType)
  paymentType: PaymentType;
  @IsEnum(DeliverType)
  deliverType: DeliverType;
}

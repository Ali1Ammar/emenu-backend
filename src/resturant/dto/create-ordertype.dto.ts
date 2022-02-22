import { DeliverType, OrderType, PaymentType, SelectKitchenVia } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

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
  @IsEnum(SelectKitchenVia)
  selectKitchenVia:SelectKitchenVia
  @IsBoolean()
  selectCustomerSpot:boolean
}

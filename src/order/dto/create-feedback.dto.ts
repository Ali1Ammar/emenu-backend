import { FeedBackType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCustomerFeedBack {
  @IsString()
  desc: string;
  @IsNumber()
  @Min(1)
  @Max(10)
  rate: number;
  @IsArray()
  @ValidateNested()
  @IsEnum(FeedBackType)
  type: FeedBackType[];
}

export class CreateCustomerFeedBackDto {
  @IsOptional()
  data?: CreateCustomerFeedBack;
}

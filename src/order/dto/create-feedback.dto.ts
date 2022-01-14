import { FeedBackType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';

export class CreateCustomerFeedBackDto {
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

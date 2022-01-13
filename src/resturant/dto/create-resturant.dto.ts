import { Exclude, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MinLength, ValidateNested } from 'class-validator';
import { RegisterDTO } from 'src/auth/dto/register.dto';
export class CreateResturantDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsUrl()
  img: string;
  @IsNotEmpty()
  @IsString()
  location: string;
}


export class CreateResturantAndAdminDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateResturantDto)
  resturant : CreateResturantDto

  @ValidateNested()
  @IsOptional()
  @Type(() => RegisterDTO)
  admin? : RegisterDTO

  @IsOptional()
  adminsId: number[];
}
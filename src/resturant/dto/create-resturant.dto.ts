import { MinLength } from 'class-validator';
import { RegisterDTO } from 'src/auth/dto/register.dto';
export class CreateResturantDto {
  name: string;
  img: string;
  location: string;
  @MinLength(1)
  adminsId: number[];
}


export class CreateResturantAndAdminDto {
  resturant : CreateResturantDto
  admin : RegisterDTO
}
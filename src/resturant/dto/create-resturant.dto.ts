import { MinLength } from 'class-validator';
export class CreateResturantDto {
  name: string;
  img: string;
  location: string;
  @MinLength(1)
  adminsId: number[];
}

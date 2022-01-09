export class CreateMealDto {
  title: string;
  desc: string;
  img: string;
  price: number;
  subCategoryId: number;
  kitchenId?: number;
}

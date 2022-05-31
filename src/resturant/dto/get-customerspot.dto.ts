import {
  CustomerSpot,
  MainCategory,
  Meal,
  OrderType,
  Resturant,
  SubCategory,
} from '@prisma/client';

export type GetCustomerSpotClientDto = {
  orderType: OrderType;
  resturant: Resturant & {
    mainCategory: (MainCategory & {
      children: (SubCategory & {
        meals: Meal[];
      })[];
    })[];
  };
  spot: CustomerSpot;
};

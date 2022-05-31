import {
    CustomerSpot,
    Kitchen,
    MainCategory,
    Meal,
    OrderType,
    Resturant,
    SubCategory,
  } from '@prisma/client';

export type GetResturantClientDto = Resturant & {
    mainCategory: (MainCategory & {
      children: (SubCategory & {
        meals: Meal[];
      })[];
    })[];
    orderType: OrderType[];
  };
  
  export type ResturantRelationDTO = Resturant & {
    kitchen: Kitchen[];
    mainCategory: (MainCategory & {
      children: SubCategory[];
    })[];
    customerSpot: CustomerSpot[];
    orderType: OrderType[];
  };
  
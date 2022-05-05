import faker from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const orderTypeData: Prisma.OrderTypeCreateInput[] = [
  {
    resturant: {
      connect: {
        id: 1,
      },
    },
    deliverMsg: 'جار احضار طلبك',
    deliverType: 'employeerDeliverFood',
    selectCustomerSpot: true,
    name: 'داخل المطعم',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: 'beforeTakeOrder',
    selectKitchenVia: 'None',
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `table ${i + 1}`,
            resturantId: 1,
          };
        }),
      },
    },
    kitchen: {
      create: {
        resturantId: 1,
        name: 'main',
      },
    },
  },
  
  {
    resturant: {
      connect: {
        id: 1,
      },
    },
    deliverMsg: 'جار احضار طلبك',
    deliverType: 'employeerDeliverFood',
    selectCustomerSpot: true,
    name: 'الطلب من السيارة',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: 'afterTakeOrder',
    selectKitchenVia: 'None',
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `park ${i + 1}`,
            resturantId: 1,
          };
        }),
      },
    },
    kitchen: {
      create: {
        resturantId: 1,
        name: 'main',
      },
    },
  },







  {
    resturant: {
      connect: {
        id: 2,
      },
    },
    deliverMsg: 'جار احضار طلبك',
    deliverType: 'employeerDeliverFood',
    selectCustomerSpot: true,
    name: 'داخل المطعم',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: 'beforeTakeOrder',
    selectKitchenVia: 'None',
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `table ${i + 1}`,
            resturantId: 2,
          };
        }),
      },
    },
    kitchen: {
      create: {
        resturantId: 2,
        name: 'main',
      },
    },
  },
  {
    resturant: {
      connect: {
        id:3,
      },
    },
    deliverMsg: 'جار احضار طلبك',
    deliverType: 'employeerDeliverFood',
    selectCustomerSpot: true,
    name: 'داخل المطعم',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: 'beforeTakeOrder',
    selectKitchenVia: 'None',
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `table ${i + 1}`,
            resturantId: 3,
          };
        }),
      },
    },
    kitchen: {
      create: {
        resturantId: 3,
        name: 'main',
      },
    },
  },

];

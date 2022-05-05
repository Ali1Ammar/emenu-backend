import faker from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const orderData: Prisma.OrderCreateInput[] = [
  {
    price: faker.datatype.number({ min: 5000, max: 40000, precision: 5000 }),
    isPayed: true,
    resturant: {
      connect: {
        id: 1,
      },
    },
    status: 'Done',
    type: {
      connect: {
        id: 1,
      },
    },
    orderItems: {
      create: [
        {
          count: 3,
          mealId: 1,
          notes: 'اضافة بصل',
          selectedExtra: ['اضافة بصل', 'اضافة بصل'],
        },
      ],
    },
    customerFeedBack: {
      create: {
        desc: 'الاكل سيئ',
        rate: 3,
        type: ['BadTiming', 'BadFood', 'BadService'],
        resturantId: 1,
      },
    },
    customerSpot: {
      connect: {
        id: 3,
      },
    },
  },
  {
    price: faker.datatype.number({ min: 5000, max: 40000, precision: 5000 }),
    isPayed: true,
    resturant: {
      connect: {
        id: 1,
      },
    },
    status: 'Done',
    type: {
      connect: {
        id: 1,
      },
    },
    orderItems: {
      create: [
        {
          count: 3,
          mealId: 1,
          notes: 'اضافة بصل',
          selectedExtra: ['اضافة بصل', 'اضافة بصل'],
        },
      ],
    },
    customerFeedBack: {
      create: {
        desc: 'الاكل سيئ',
        rate: 5,
        type: ['BadTiming'],
        resturantId: 1,
      },
    },
    customerSpot: {
      connect: {
        id: 3,
      },
    },
  },
  {
    price: faker.datatype.number({ min: 5000, max: 40000, precision: 5000 }),
    isPayed: true,
    resturant: {
      connect: {
        id: 1,
      },
    },
    status: 'Done',
    type: {
      connect: {
        id: 1,
      },
    },
    orderItems: {
      create: [
        {
          count: 3,
          mealId: 1,
          notes: 'اضافة بصل',
          selectedExtra: ['اضافة بصل', 'اضافة بصل'],
        },
      ],
    },
    customerFeedBack: {
      create: {
        desc: 'الاكل سيئ',
        rate: 5,
        type: ['BadTiming'],
        resturantId: 1,
      },
    },
    customerSpot: {
      connect: {
        id: 3,
      },
    },
  },
  {
    price: faker.datatype.number({ min: 5000, max: 40000, precision: 5000 }),
    isPayed: true,
    resturant: {
      connect: {
        id: 1,
      },
    },
    status: 'Done',
    type: {
      connect: {
        id: 1,
      },
    },
    orderItems: {
      create: [
        {
          count: 3,
          mealId: 1,
          notes: 'اضافة بصل',
          selectedExtra: ['اضافة بصل', 'اضافة بصل'],
        },
      ],
    },
    customerFeedBack: {
      create: {
        desc: 'الاكل سيئ',
        rate: 5,
        type: ['BadTiming'],
        resturantId: 1,
      },
    },
    customerSpot: {
      connect: {
        id: 3,
      },
    },
  },
  {
    price: faker.datatype.number({ min: 5000, max: 40000, precision: 5000 }),
    isPayed: true,
    resturant: {
      connect: {
        id: 1,
      },
    },
    status: 'Done',
    type: {
      connect: {
        id: 1,
      },
    },
    orderItems: {
      create: [
        {
          count: 3,
          mealId: 1,
          notes: 'اضافة بصل',
          selectedExtra: ['اضافة بصل', 'اضافة بصل'],
        },
      ],
    },
    customerFeedBack: {
      create: {
        desc: 'الاكل سيئ',
        rate: 5,
        type: ['BadTiming'],
        resturantId: 1,
      },
    },
    customerSpot: {
      connect: {
        id: 3,
      },
    },
  },
];

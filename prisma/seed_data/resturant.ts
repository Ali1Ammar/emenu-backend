import faker from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const restData: Prisma.ResturantCreateInput[] = [
  {
    name: 'firefireburger',
    img: 'uploaded/burgerlogo.png',
    location: faker.address.city(),
    isDisabled: false,
    admins: {
      connect: {
        id: 1,
      },
    },
  },
  {
    name: 'buger king',
    img: 'uploaded/burget-king.png',
    location: faker.address.city(),
    isDisabled: false,
    admins: {
      connect: {
        id: 2,
      },
    },
  },
  {
    name: 'pizza hut',
    img: 'uploaded/pizzahut.jpg',
    location: faker.address.city(),
    isDisabled: false,
    admins: {
      connect: {
        id: 2,
      },
    },
  },
];

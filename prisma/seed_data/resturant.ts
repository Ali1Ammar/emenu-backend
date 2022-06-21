import faker from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const restData = [
  {
    id:1,
    name: 'شاورما على نار',
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
    id:2,

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
    id:3,

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

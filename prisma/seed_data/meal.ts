import faker from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const mealsData: Prisma.MealCreateInput[] = [
  {
    title: 'بركر فاير',
    desc: '200 غرام من الحمه مع البصل المقرمش والمشروم',
    img: 'uploaded/Best-Burger-5.jpg',
    price: 6500,
    subCategory: {
      connect: { id: 1 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    title: 'بركر دجاج',
    desc: '200 غرام من دجاج مع البصل المقرمش وصلصه الثوم',
    img: 'uploaded/Best-Burger-5.jpg',
    price: 4500,
    subCategory: {
      connect: { id: 1 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    title: 'بركر بالجبن ',
    desc: '200 غرام من  الحمه وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/index.jpeg',
    price: 7500,
    subCategory: {
      connect: { id: 1 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة صلصة', 'ازالة المخلل'],
    },
  },
  {
    title: 'شاورما لحم',
    desc: '20 وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/88aef3e6-53d4-460b-afc1-0862458103f9.jpeg',
    price: 6500,
    subCategory: {
      connect: { id: 2 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    title: 'شاورما',
    desc: '20    وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategory: {
      connect: { id: 2 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    title: 'بيتزا دجاج',
    desc: 'بيتزا بشاورما الدجاج مع الخضار',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategory: {
      connect: { id: 2 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة زيتون', 'ازالة الفلفل'],
    },
  },

  {
    title: 'بيتزا لحم',
    desc: 'بيتزا بشاروما اللحم مع الخضار',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategory: {
      connect: { id: 2 },
    },
    kitchen: {
      connect: {
        id: 1,
      },
    },
    extra: {
      set: ['اضافة بصل', 'اضافة زيتون', 'ازالة الفلفل'],
    },
  },
];

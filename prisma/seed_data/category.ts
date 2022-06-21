import { Prisma } from "@prisma/client";

export const mainCategorys: Prisma.MainCategoryCreateInput[] = [
    {
      title: 'سناكات والوجبات السريعة',
      desc: 'برغر كنتاكي بيتزا شاروما وغيرها',
      img: 'uploaded/Best-Burger-5.jpg',
      children: {
        createMany: {
          data: [
            {
              title: 'همبركر',
            },
            {
              title: 'بيتزا',
            },
            {
              title: 'شاورما',
            },
            {
              title: 'كنتاكي',
            },

          ],
        },
      },
      resturant: {
        connect: {
          id: 1,
        },
      },
    },
    {
      title: 'المطبخ الشرقي',
      desc: 'اشهى الاكلات الشرقية والعربية',
      img: 'uploaded/east.png',
      children: {
        createMany: {
          data: [
            {
              title: 'المشويات',
            },
            {
              title: 'عراقي',
            },
            {
              title: 'مصري',
            },
            {
              title: 'التمن والمرق',
            },
          ],
        },
      },
      resturant: {
        connect: {
          id: 1,
        },
      },
    },
    {
      title: 'المطبخ الايطالي',
      desc: 'اشهى الاكلات  الايطاليا , بيتزا وباستا ',
      img: 'uploaded/pizza2.jpg',
      children: {
        createMany: {
          data: [
            {
              title: 'باستا',
            },
            {
              title: 'ستيك',
            },
            {
              title: 'باستا',
            },
          ],
        },
      },
      resturant: {
        connect: {
          id: 1,
        },
      },
    },
  ];

import faker from '@faker-js/faker';
import { PrismaClient, Prisma, UserPermissions } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userData: Prisma.UserCreateInput[] = [
    {
      name: 'admin2',
      password: "$argon2i$v=19$m=4196,t=3,p=1$9fV7OvDjXuQwFEDt+xRv1w$c82ektuHHtZAK1cDVDlF8gK7vzr7E1ldyMNJsqTYFIg",
      userName: 'admin2',
      permissons: [UserPermissions.SystemAdmin],
    },
  ];

  const restData: Prisma.ResturantCreateInput[] = [
    {
      name: 'firefireburger',
      img: faker.image.food(),
      location: faker.address.city(),
      customerSpot: {
        createMany: {
          data: Array(7).map((d) => {
            return {
              identifier: `table ${d + 1}`,
            };
          }),
        },
      },
      admins: {
        connect: {
          id: 1,
        },
      },
      orderType: {
        create: {
          deliverMsg: 'جار احضار طلبك',
          deliverType: 'employeerDeliverFood',
          name: 'داخل المطعم',
          paymentMsg: 'انتضر الويتر للدفع',
          paymentType: 'beforeTakeOrder',
          selectKitchenVia: 'None',
          kitchen: {
            create: {
              resturantId: 1,
              name: 'main',
            },
          },
        },
      },
    },
  ];

  const mainCategorys: Prisma.MainCategoryCreateInput[] = [
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
              title: 'همبركر',
            },
            {
              title: 'كنتاكي',
            },
            {
              title: 'بيتزا',
            },
            {
              title: 'شاورما',
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
      img: 'uploaded/Best-Burger-5.jpg',
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
      title: 'المطبخ الغربي',
      desc: 'اشهى الاكلات الغربية والاوربيا ',
      img: 'uploaded/Best-Burger-5.jpg',
      children: {
        createMany: {
          data: [
            {
              title: 'باستا',
            },
            {
              title: 'ستيك',
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

  const mealsData: Prisma.MealCreateInput[] = [
    {
      title: "بركر فاير",
      desc: "200 غرام من الحمه مع البصل المقرمش والمشروم",
      img: 'uploaded/Best-Burger-5.jpg',
      price: faker.datatype.number({ min: 5111, max: 11111, precision: 5111 }),
      subCategory: {
        connect: { id: 1 },
      },
      extra: {
        set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
      },
    },
    {
      title: "بركر دجاج",
      desc: "200 غرام من دجاج مع البصل المقرمش وصلصه الثوم",
      img: 'uploaded/Best-Burger-5.jpg',
      price: faker.datatype.number({ min: 5111, max: 11111, precision: 5111 }),
      subCategory: {
        connect: { id: 1 },
      },
      extra: {
        set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
      },
    },
    {
      title: "بركر محشي شاورما",
      desc: "200 غرام من  الحمه وشاورما مع البصل المقرمش والمشروم",
      img: 'uploaded/Best-Burger-5.jpg',
      price: faker.datatype.number({ min: 5111, max: 11111, precision: 5111 }),
      subCategory: {
        connect: { id: 1 },
      },
      extra: {
        set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
      },
    },
  ];

  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
  }

  for (const u of restData) {
    const user = await prisma.resturant.create({
      data: u,
    });
  }

  for (const u of mainCategorys) {
    const user = await prisma.mainCategory.create({
      data: u,
    });
  }

  for (const u of mealsData) {
    const user = await prisma.meal.create({
      data: u,
    });
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

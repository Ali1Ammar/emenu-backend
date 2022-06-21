import { PrismaClient, Prisma, UserPermissions } from '@prisma/client';
import * as rest1 from './seed_data/rest_1';
import * as rest2 from './seed_data/rest_2';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  const data = [rest1,rest2];
  for (const item of data) {
    const { user, orderTypes, category, mealsData, rest, kitchen } = item;
    await prisma.user.create({
      data: user,
    });
    const resturantData = await prisma.resturant.create({
      data: rest,
    });

    await prisma.kitchen.create({
      data: kitchen,
    });

    for (const key of orderTypes) {

      await prisma.orderType.create({
        data: key,
      });
    }
    for (const key of category) {
      await prisma.mainCategory.create({
        data: key,
      });
    }

    for (const key of mealsData) {
      await prisma.meal.create({
        data: key,
      });
    }

    console.log(`Seeded ${resturantData.name}`);
  }
  // for (const u of userData) {
  //   const user = await prisma.user.create({
  //     data: u,
  //   });
  // }

  // for (const u of restData) {
  //   const user = await prisma.resturant.create({
  //     data: u,
  //   });
  // }

  // for (const u of orderTypeData) {
  //   const user = await prisma.orderType.create({
  //     data: u,
  //   });
  // }

  // for (const u of mainCategorys) {
  //   const user = await prisma.mainCategory.create({
  //     data: u,
  //   });
  // }

  // for (const u of mealsData) {
  //   const user = await prisma.meal.create({
  //     data: u,
  //   });
  // }

  // for (const u of orderData) {
  //   const user = await prisma.order.create({
  //     data: u,
  //   });
  // }
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

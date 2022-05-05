import faker from '@faker-js/faker';
import { PrismaClient, Prisma, UserPermissions } from '@prisma/client';
import { mainCategorys } from './seed_data/category';
import { mealsData } from './seed_data/meal';
import { orderData } from './seed_data/order';
import { orderTypeData } from './seed_data/ordertype';
import { restData } from './seed_data/resturant';
import { userData } from './seed_data/user';
const prisma = new PrismaClient();

async function main() {
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

  for (const u of orderTypeData) {
    const user = await prisma.orderType.create({
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

  for (const u of orderData) {
    const user = await prisma.order.create({
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

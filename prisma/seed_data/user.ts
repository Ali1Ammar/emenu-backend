import { Prisma } from "@prisma/client";
import { PasswordHashHelper } from "src/helper/hash_password";

export const userData: Prisma.UserCreateInput[] = [
    {
      name: 'admin2',
      password: "$argon2i$v=19$m=4096,t=3,p=1$zkcSsG39hIJOYPvShvNQLQ$KmjqBmkuKM76Gi2nC/RNBUheo8qh4dlhblMt35SWL9M",
      userName: 'admin2',
      permissons: ['ResturantAdmin'],
    },
    {
      name: 'admin2',
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$zkcSsG39hIJOYPvShvNQLQ$KmjqBmkuKM76Gi2nC/RNBUheo8qh4dlhblMt35SWL9M',
      userName: 'admin25',
      permissons: ['ResturantAdmin'],
    },
  ];

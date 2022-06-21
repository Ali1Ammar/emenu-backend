import {
  DeliverType,
  PaymentType,
  SelectKitchenVia,
  UserPermissions,
} from '@prisma/client';

const xId = 1;
function getId(id: number): number {
  return id * xId;
}
export { user, rest, category, mealsData, orderTypes,kitchen };
const user = {
  id: getId(1),
  name: 'admin2'+getId(1),
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$zkcSsG39hIJOYPvShvNQLQ$KmjqBmkuKM76Gi2nC/RNBUheo8qh4dlhblMt35SWL9M',
    userName: 'admin2'+getId(1),
    permissons: [UserPermissions.ResturantAdmin],
};

const rest = {
  id: getId(1),
  name: 'burger king',
  img: 'uploaded/burget-king.png',
  location: 'baghdad',
  isDisabled: false,
  admins: {
    connect: {
      id: getId(1),
    },
  },
};


const kitchen =  {
    name: 'main', 
    resturantId:getId(1),
    id:getId(1),
  };


const orderTypes = [
  {
    resturantId: getId(1),

    deliverMsg: 'جار احضار طلبك',
    deliverType: DeliverType.employeerDeliverFood,
    selectCustomerSpot: true,
    name: 'داخل المطعم',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: PaymentType.beforeTakeOrder,
    selectKitchenVia: SelectKitchenVia.None,
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `table ${i + 1}`,
            resturantId: getId(1),
          };
        }),
      },
    },
    kitchen: {
      connect: {
        id: getId(1),
      }
    },
  },
  {
    resturantId: getId(1),
    deliverMsg: 'جار احضار طلبك',
    deliverType: DeliverType.employeerDeliverFood,
    selectCustomerSpot: true,
    name: 'الطلب من السيارة',
    paymentMsg: 'انتضر الويتر للدفع',
    paymentType: PaymentType.afterTakeOrder,
    selectKitchenVia: SelectKitchenVia.None,
    customerSpot: {
      createMany: {
        data: Array.from({ length: 7 }, (_, i) => {
          return {
            identifier: `park ${i + 1}`,
            resturantId: getId(1),
          };
        }),
      },
    },
    kitchen: {
        connect: {
          id: getId(1),
        }
      },
  },
];
const category = [
  {
    id: getId(1),
    title: 'سناكات والوجبات السريعة',
    desc: 'برغر كنتاكي شاروما وغيرها',
    img: 'uploaded/Best-Burger-5.jpg',
    children: {
      createMany: {
        data: [
          {
            id: getId(1),
            title: 'همبركر',
          },
          {
            id: getId(2),

            title: 'شاورما',
          },
          {
            id: getId(3),

            title: 'كنتاكي',
          },
        ],
      },
    },
    resturantId: getId(1),
  },
  {
    id: getId(2),
    title: 'المطبخ الايطالي',
    desc: 'اشهى الاكلات  الايطاليا , بيتزا وباستا ',
    img: 'uploaded/pizza2.jpg',
    children: {
      createMany: {
        data: [
          {
            id: getId(4),

            title: 'باستا',
          },
          {
            id: getId(5),

            title: 'ستيك',
          },
          {
            id: getId(6),

            title: 'بيتزا',
          },
        ],
      },
    },
    resturantId: getId(1),
  },
  {
    id: getId(3),
    title: 'المشروبات',
    desc: 'العصائر الطبيعية والغازيه ومختلف المشوربات',
    img: 'uploaded/juice.jpg',
    children: {
      createMany: {
        data: [
          {
            id: getId(7),

            title: 'عصائر طبيعية',
          },
          {
            id: getId(8),

            title: 'مشروبات غازية',
          },
          {
            id: getId(9),

            title: 'مشروبات ساخنة',
          },
        ],
      },
    },
    resturantId: getId(1),
  },
];

const mealsData = [
  {
    id: getId(1),
    title: 'بركر فاير',
    desc: '200 غرام من الحمه مع البصل المقرمش والمشروم',
    img: 'uploaded/Best-Burger-5.jpg',
    price: 6500,
    subCategoryId: getId(1),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    id: getId(2),

    title: 'بركر دجاج',
    desc: '200 غرام من دجاج مع البصل المقرمش وصلصه الثوم',
    img: 'uploaded/Best-Burger-5.jpg',
    price: 4500,
    subCategoryId: getId(1),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    id: getId(3),

    title: 'بركر بالجبن ',
    desc: '200 غرام من  الحمه وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/index.jpeg',
    price: 7500,
    subCategoryId: getId(1),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة صلصة', 'ازالة المخلل'],
    },
  },
  {
    id: getId(4),

    title: 'شاورما لحم',
    desc: '20 وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/88aef3e6-53d4-460b-afc1-0862458103f9.jpeg',
    price: 6500,
    subCategoryId: getId(2),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    id: getId(5),

    title: 'شاورما دجاج',
    desc: '20    وشاورما مع البصل المقرمش والمشروم',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategoryId: getId(2),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة جبن', 'ازالة المخلل'],
    },
  },
  {
    id: getId(6),

    title: 'بيتزا دجاج',
    desc: 'بيتزا بشاورما الدجاج مع الخضار',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategoryId: getId(6),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة زيتون', 'ازالة الفلفل'],
    },
  },

  {
    id: getId(7),

    title: 'بيتزا لحم',
    desc: 'بيتزا بشاروما اللحم مع الخضار',
    img: 'uploaded/pizza2.jpg',
    price: 6500,
    subCategoryId: getId(6),

    kitchenId: getId(1),

    extra: {
      set: ['اضافة بصل', 'اضافة زيتون', 'ازالة الفلفل'],
    },
  },
  {
    id: getId(8),

    title: 'ستيك لحم',
    desc: 'ستيك مشوي على الطريقه الايطالية',
    img: 'uploaded/steak.jpg',
    price: 15000,
    subCategoryId: getId(5),

    kitchenId: getId(1),
  },
  {
    id: getId(9),

    title: 'باستا خضار',
    desc: 'باستا ايطالية مع خضار مسلوقة',
    img: 'uploaded/pista.jpg',
    price: 6500,
    subCategoryId: getId(4),
    kitchenId: getId(1),
  },
  {
    id: getId(10),

    title: 'عصير برتقال طبيعي',
    desc: '',
    img: 'uploaded/oringe.jpg',
    price: 4500,
    subCategoryId: getId(7),
    kitchenId: getId(1),
  },
  {
    id: getId(11),

    title: 'عصير تفاح طبيعي',
    desc: '',
    img: 'uploaded/apple.jpg',
    price: 4500,
    subCategoryId: getId(7),
    kitchenId: getId(1),
  },
  {
    id: getId(12),

    title: 'بيبسي',
    desc: '',
    img: 'uploaded/pepsi.jpg',
    price: 500,
    subCategoryId: getId(8),
    kitchenId: getId(1),
  },
  {
    id: getId(13),

    title: 'سفن',
    desc: '',
    img: 'uploaded/saven.jpg',
    price: 500,
    subCategoryId: getId(8),
    kitchenId: getId(1),
  },
  {
    id: getId(14),

    title: 'شاي',
    desc: '',
    img: 'uploaded/tea.jpg',
    price: 500,
    subCategoryId: getId(9),
    kitchenId: getId(1),
  },
  {
    id: getId(15),

    title: 'قهوة',
    desc: '',
    img: 'uploaded/coffe.jpg',
    price: 1500,
    subCategoryId: getId(9),
    kitchenId: getId(1),
  },
  {
    id: getId(16),

    title: 'كنتاكي 3 قطع',
    desc: '',
    img: 'uploaded/kintack.jpeg',
    price: 6000,
    subCategoryId: getId(3),
    kitchenId: getId(1),
  },
  {
    id: getId(17),

    title: 'كنتاكي 6 قطع',
    desc: '',
    img: 'uploaded/kintack.jpeg',
    price: 10000,
    subCategoryId: getId(3),
    kitchenId: getId(1),
  },
];

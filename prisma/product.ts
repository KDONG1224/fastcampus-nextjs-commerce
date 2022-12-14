import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const productData: Prisma.productsCreateInput[] = Array.apply(
//   null,
//   Array(30)
// ).map((_, idx) => ({
//   name: `HOODIE ${idx + 1}`,
//   contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 HOODIE No.${
//     idx + 1
//   } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
//   category_id: 5,
//   image_url: `https://picsum.photos/id/${Math.floor(
//     Math.random() * (1000 - idx + 1)
//   )}/1000/600`,
//   price: Math.floor(Math.random() * (100000 - 20000) + 20000)
// }));

export const SNEAKERS: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Sneakers ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 Sneakers No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 1,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

export const TSHIRT: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `T-Shirt ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 T-Shirt No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 2,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

export const PANTS: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `PANTS ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 PANTS No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 3,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

export const CAP: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `CAP ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 CAP No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 4,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

export const HOODIE: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `HOODIE ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 HOODIE No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 5,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

export const productsItmes: Prisma.productsCreateInput[] = [
  ...SNEAKERS,
  ...TSHIRT,
  ...PANTS,
  ...CAP,
  ...HOODIE
];

const main = async () => {
  const CATEGORY_NAME = ['Sneakers', 'T-Shirt', 'Pants', 'Cap', 'Hoodie'];

  CATEGORY_NAME.forEach(async (name, idx) => {
    const category = await prisma.categories.upsert({
      where: {
        id: idx + 1
      },
      update: {
        name: name
      },
      create: {
        name: name
      }
    });
    console.log(
      'category id : ',
      category.id,
      'category name : ',
      category.name
    );
  });

  // await prisma.products.deleteMany({});

  for (const p of productsItmes) {
    const product = await prisma.products.create({
      data: p
    });

    console.log(`== Created == : ${product.id} / ${product.name}`);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

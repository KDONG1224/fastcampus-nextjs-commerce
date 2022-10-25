import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(100)
).map((_, idx) => ({
  name: `Blue Jean ${idx + 1}`,
  contents: `{"blocks":[{"key":"3f19l","text":"This is a Dark Jean ${
    idx + 1
  }","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":19,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"6u8pb","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4bvfe","text":"so so so so so so ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
  category_id: 1,
  image_url: `https://picsum.photos/id/${idx + 1}/1000/600/`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

const main = async () => {
  await prisma.products.deleteMany({});

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p
    });

    console.log(`== Created id == : ${product.id}`);
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

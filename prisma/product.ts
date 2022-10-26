import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(50)
).map((_, idx) => ({
  name: `HOODIE ${idx + 1}`,
  contents: `{"blocks":[{"key":"3f19l","text":"This is a HOODIE ${
    idx + 1
  }","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":19,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"6u8pb","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4bvfe","text":"본 제품은 HOODIE 제품입니다.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
  category_id: 5,
  image_url: `https://picsum.photos/id/1022/1000/600/`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000)
}));

const main = async () => {
  // await prisma.products.deleteMany({});

  for (const p of productData) {
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

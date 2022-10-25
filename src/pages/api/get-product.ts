// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function getProducts(id: number) {
  try {
    const res = await prisma.products.findUnique({
      where: { id: id }
    });

    console.log('== res == : ', res);

    return res;
  } catch (error) {
    console.error(error);
  }
}

type Data = {
  items?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (id == null) {
    res.status(200).json({ message: 'no id' });
  }
  try {
    const products = await getProducts(Number(id));
    res.status(200).json({ items: products, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

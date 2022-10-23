// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function getProducts() {
  try {
    const res = await prisma.products.findMany();

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
  try {
    const products = await getProducts();
    res.status(200).json({ items: products, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function getProductsCount(category: number, contains: string) {
  const containsCondition =
    contains && contains !== ''
      ? {
          name: { contains: contains }
        }
      : undefined;

  const where =
    category && category !== -1
      ? {
          category_id: category,
          ...containsCondition
        }
      : containsCondition
      ? containsCondition
      : undefined;

  try {
    const res = await prisma.products.count({
      where: where
    });

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
  const { category, contains } = req.query;
  try {
    const products = await getProductsCount(Number(category), String(contains));
    res.status(200).json({ items: products, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

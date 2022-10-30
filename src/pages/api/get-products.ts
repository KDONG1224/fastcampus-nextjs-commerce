// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import { getOrderBy } from 'const/products';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type GetProductsProps = {
  skip: number;
  take: number;
  category: number;
  orderBy: string;
  contains: string;
};

async function getProducts({
  skip,
  take,
  category,
  orderBy,
  contains
}: GetProductsProps) {
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

  const orderByCondition = getOrderBy(orderBy);

  try {
    const res = await prisma.products.findMany({
      skip: skip,
      take: take,
      ...orderByCondition,
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
  const { skip, take, category, orderBy, contains } = req.query;
  if (skip == null || take == null) {
    res.status(200).json({ message: 'no skip or take' });
    return;
  }

  try {
    const products = await getProducts({
      skip: Number(skip),
      take: Number(take),
      category: Number(category),
      orderBy: String(orderBy),
      contains: contains ? String(contains) : ''
    });

    res.status(200).json({ items: products, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

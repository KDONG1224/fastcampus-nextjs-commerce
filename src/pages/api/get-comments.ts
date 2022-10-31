// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function getComments(productId: number) {
  try {
    let res = [];

    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: productId
      }
    });

    for (const orderItem of orderItems) {
      const _res = await prisma.comment.findUnique({
        where: {
          orderItemId: orderItem.id
        }
      });

      if (_res) {
        res.push({ ...orderItem, ..._res });
      }
    }

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
  const { productId } = req.query;

  try {
    const comments = await getComments(Number(productId));

    res.status(200).json({ items: comments, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

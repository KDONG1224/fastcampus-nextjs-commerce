// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function updateOrderStatus(id: number, status: number) {
  console.log(id);
  console.log(status);

  try {
    const orderItem = await prisma.orders.update({
      where: { id: id },
      data: { status: status }
    });
    console.log(orderItem);
    return orderItem;
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
  const session = await unstable_getServerSession(req, res, authOptions);
  const { selectId, status } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const comment = await updateOrderStatus(Number(selectId), Number(status));
    res.status(200).json({ items: comment, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

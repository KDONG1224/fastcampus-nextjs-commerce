// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Cart, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function addCartItem(userId: string, item: Omit<Cart, 'id' | 'userId'>) {
  try {
    const res = await prisma.cart.create({
      data: {
        userId,
        ...item
      }
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
  const session = await unstable_getServerSession(req, res, authOptions);
  const { cartItem } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await addCartItem(String(session.id), cartItem);
    res.status(200).json({ items: wishlist, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

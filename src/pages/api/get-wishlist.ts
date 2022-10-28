// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getWishlist(userId: string) {
  try {
    const res = await prisma.wishlist.findUnique({
      where: {
        userId: userId
      }
    });

    return res?.productIds.split(',');
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

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await getWishlist(String(session.id));

    res.status(200).json({ items: wishlist, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

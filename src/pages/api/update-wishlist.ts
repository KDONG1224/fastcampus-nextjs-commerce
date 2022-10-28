// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function updateWishlist(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId
      }
    });

    const originWishlist =
      wishlist?.productIds != null && wishlist.productIds != ''
        ? wishlist.productIds.split(',')
        : [];
    const isWished = originWishlist.includes(productId);

    const newWishlist = isWished
      ? originWishlist.filter((id) => id !== productId)
      : [...originWishlist, productId];

    const res = await prisma.wishlist.upsert({
      where: {
        userId
      },
      update: {
        productIds: newWishlist.join(',')
      },
      create: {
        userId,
        productIds: newWishlist.join(',')
      }
    });

    return res.productIds.split(',');
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
  const { pid } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await updateWishlist(String(session.id), String(pid));
    res.status(200).json({ items: wishlist, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

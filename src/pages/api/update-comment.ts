// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function updateComment(data: {
  userId: string;
  orderItemId: number;
  rate: number;
  contents: string;
  images: string;
}) {
  try {
    const { userId, orderItemId, rate, contents, images } = data;

    const res = await prisma.comment.upsert({
      where: {
        orderItemId
      },
      update: {
        rate,
        contents,
        images
      },
      create: {
        userId,
        orderItemId,
        rate,
        contents,
        images
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
  const { orderItemId, rate, contents, images } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const comment = await updateComment({
      userId: String(session.id),
      orderItemId: Number(orderItemId),
      rate: rate,
      contents: contents,
      images: images
    });
    res.status(200).json({ items: comment, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

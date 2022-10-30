// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OrderItem, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getOrder(userId: string) {
  try {
    // orders 테이블에서 나의 주문들을 조회한다.
    // orders 안에 있는 orderItemIds로 orderItem을 꺼내고, products 테이블에서 이미지 등 정보를 조합한다.
    let res = [];

    const orders = await prisma.orders.findMany({
      where: {
        userId: userId
      }
    });

    for (const order of orders) {
      let orderItems: OrderItem[] = [];

      for (const id of order.orderItemIds
        .split(',')
        .map((item) => Number(item))) {
        const _res: OrderItem[] =
          await prisma.$queryRaw`SELECT i.id, quantity, amount, i.price, name, image_url, productId FROM OrderItem as i JOIN products as p ON i.productId=p.id WHERE i.id=${id};`;
        orderItems.push.apply(orderItems, _res);
      }

      res.push({ ...order, orderItems });
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
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await getOrder(String(session.id));

    res.status(200).json({ items: wishlist, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

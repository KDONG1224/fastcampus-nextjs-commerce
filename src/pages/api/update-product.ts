// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function updateProduct(id: number, contents: string) {
  try {
    const res = await prisma.products.update({
      where: { id: id },
      data: { contents: contents }
    });

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
  const { id, contents } = JSON.parse(req.body);
  if (id == null || contents == null) {
    res.status(200).json({ message: 'no id or contents' });
    return;
  }
  try {
    const products = await updateProduct(Number(id), contents);
    res.status(200).json({ items: products, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

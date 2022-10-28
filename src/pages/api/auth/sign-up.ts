// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import jwtDecode from 'jwt-decode';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function signUp(credential: string) {
  const decoded: { name: string; email: string; picture: string } =
    jwtDecode(credential);

  try {
    const user = await prisma.user.upsert({
      where: {
        email: decoded.email
      },
      update: {
        name: decoded.name,
        image: decoded.picture
      },
      create: {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture
      }
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}

type Data = {
  user?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { credential } = req.query;
  try {
    const userProfile = await signUp(String(credential));
    res.status(200).json({ user: userProfile, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

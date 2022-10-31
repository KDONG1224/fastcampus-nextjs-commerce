// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({
  auth: 'secret_b1vw1gK3gk9G1yKqchZHDMvENcSK7zYgovhnGwiCpMx'
});

const databaseId = 'ef7a884231c749dc9607a41e1afb7ba9';

async function getDetail(pageId: string) {
  try {
    const res = await notion.pages.retrieve({
      page_id: pageId
    });

    return res;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  detail?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { pageId } = req.query;

    const _res = await getDetail(pageId as string);

    res.status(200).json({ detail: _res?.object, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

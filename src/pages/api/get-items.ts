// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({
  auth: 'secret_b1vw1gK3gk9G1yKqchZHDMvENcSK7zYgovhnGwiCpMx'
});

const databaseId = 'ef7a884231c749dc9607a41e1afb7ba9';

async function getItems() {
  try {
    const res = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'price',
          direction: 'ascending'
        }
      ]
    });

    return res;
  } catch (error) {
    console.error(JSON.stringify(error));
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
  try {
    const _res = await getItems();
    res.status(200).json({ items: _res?.results, message: 'Success' });
  } catch (error) {
    res.status(200).json({ message: 'Failed' });
  }
}

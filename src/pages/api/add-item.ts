// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({
  auth: 'secret_b1vw1gK3gk9G1yKqchZHDMvENcSK7zYgovhnGwiCpMx'
});

const databaseId = 'ef7a884231c749dc9607a41e1afb7ba9';

async function addItem(name: string) {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: [
          {
            text: {
              content: name
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name } = req.query;

  if (name == null) {
    return res.status(400).json({ message: 'No name' });
  }

  try {
    await addItem(name as string);
    res.status(200).json({ message: `Success ${name} added item` });
  } catch (error) {
    res.status(200).json({ message: `Fail ${name} added item` });
  }
}

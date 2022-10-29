import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/prisma/client';

type Data = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await client.user.create({
    data: {
      id: '1',
      password: '1',
      nickname: '1',
    },
  });

  res.status(200).json({ ok: true });
}

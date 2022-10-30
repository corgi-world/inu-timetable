import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/prisma/client';
import { IUser } from '@/types/auth';

type Data = {
  ok: boolean;
  message: string;
};

interface IRequest extends NextApiRequest {
  body: IUser;
}

export default async function handler(
  req: IRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ ok: false, message: 'Only POST requests allowed' });
    return;
  }

  try {
    const { id, nickname, password } = req.body;

    const { isOverlap, overlapMessage } = await checkOverlap(id, nickname);
    if (isOverlap) {
      res.status(202).json({ ok: false, message: overlapMessage });
      return;
    }

    await client.user.create({
      data: {
        id,
        password,
        nickname,
      },
    });

    res.status(200).json({ ok: true, message: '회원가입 완료' });
  } catch {
    res
      .status(202)
      .json({ ok: false, message: '회원가입 실패 - 데이터베이스 오류' });
  }
}

async function checkOverlap(id: string, nickname: string) {
  const overlapUsers = await client.user.findMany({
    where: {
      OR: [
        {
          id: {
            equals: id,
          },
        },
        {
          nickname: {
            equals: nickname,
          },
        },
      ],
    },
  });

  let overlapMessage = '';
  for (const user of overlapUsers) {
    if (user.id === id) {
      overlapMessage = '이미 존재하는 아이디입니다.';
    } else if (user.nickname === nickname) {
      overlapMessage = '이미 존재하는 닉네임입니다.';
    }
  }

  const isOverlap = 0 < overlapUsers.length;

  return { isOverlap, overlapMessage };
}

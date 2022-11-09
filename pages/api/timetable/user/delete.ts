import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/prisma/client';
import type { IDefaultDeleteResponse } from '@/types/apiResponse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IDefaultDeleteResponse>,
) {
  const { id, semester } = req.query;
  if (!id || !semester) {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - query string 오류' });
    return;
  }

  try {
    const result = await client.timetables.deleteMany({
      where: {
        AND: {
          id: {
            equals: id as string,
          },
          semester: {
            equals: semester as string,
          },
        },
      },
    });

    if (result.count) {
      res.status(200).json({ ok: true, message: '삭제 완료' });
    } else if (!result.count) {
      res.status(200).json({ ok: true, message: '삭제할 시간표가 없음' });
    }
  } catch {
    res
      .status(200)
      .json({ ok: false, message: '삭제 실패 - 데이터베이스 오류' });
  }
}

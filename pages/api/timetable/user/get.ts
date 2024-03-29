import type { NextApiRequest, NextApiResponse } from 'next';
import type { ITimetable } from '@/types/timetable';
import client from '@/prisma/client';
import { IUserTimetableResponse } from '@/types/apiResponse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserTimetableResponse>,
) {
  const { id, semester } = req.query;
  if (!id || !semester) {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - query string 오류' });
    return;
  }

  try {
    const result = await client.timetables.findFirst({
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

    if (result) {
      const {
        index,
        id,
        nickname,
        semester,
        college,
        major,
        grade,
        totalGrades,
        timetables,
        likeUsers,
      } = result;

      const userTimetable = {
        index,
        id,
        nickname,
        semester,
        college,
        major,
        grade,
        totalGrades,
        timetables: JSON.parse(timetables as string) as ITimetable[],
        likeUsers: JSON.parse(likeUsers as string) as string[],
      };

      res
        .status(200)
        .json({ ok: true, message: '불러오기 완료', userTimetable });
    } else if (!result) {
      res.status(200).json({ ok: true, message: '저장된 시간표가 없음' });
    }
  } catch {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - 데이터베이스 오류' });
  }
}

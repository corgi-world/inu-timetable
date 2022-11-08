import type { NextApiRequest, NextApiResponse } from 'next';
import type { ITimetable, IUserTimetable } from '@/types/timetable';
import client from '@/prisma/client';

type Data = {
  ok: boolean;
  message?: string;
  userTimetable?: IUserTimetable;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
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
      const { id, nickname, semester, major, grade, totalGrades, timetables } =
        result;

      const userTimetable = {
        id,
        nickname,
        semester,
        major,
        grade,
        totalGrades,
        timetables: JSON.parse(timetables as string) as ITimetable[],
      };

      res.status(200).json({ ok: true, userTimetable });
    } else if (!result) {
      res
        .status(200)
        .json({ ok: false, message: '불러오기 실패 - 데이터베이스 오류' });
    }
  } catch {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - 데이터베이스 오류' });
  }
}
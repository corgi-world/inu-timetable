import type { NextApiRequest, NextApiResponse } from 'next';
import type { ITimetable, IUserTimetable } from '@/types/timetable';
import client from '@/prisma/client';

type Data = {
  ok: boolean;
  message?: string;
  userTimetables?: IUserTimetable;
};

interface IRequest extends NextApiRequest {
  body: { id: string };
}

export default async function handler(
  req: IRequest,
  res: NextApiResponse<Data>,
) {
  const { id } = req.body;

  try {
    const result = await client.timetables.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (result) {
      const { id, nickname, semester, major, grade, totalGrades, timetables } =
        result;

      const userTimetables = {
        id,
        nickname,
        semester,
        major,
        grade,
        totalGrades,
        timetables: JSON.parse(timetables as string) as ITimetable[],
      };

      res.status(200).json({ ok: true, userTimetables });
    } else if (!result) {
      res.status(200).json({ ok: true });
    }
  } catch {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - 데이터베이스 오류' });
  }
}

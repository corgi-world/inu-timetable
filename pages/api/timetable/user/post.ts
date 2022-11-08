import type { NextApiRequest, NextApiResponse } from 'next';
import type { IUserTimetable } from '@/types/timetable';
import client from '@/prisma/client';
import type { IDefaultPostResponse } from '@/types/apiResponse';

interface IRequest extends NextApiRequest {
  body: IUserTimetable;
}

export default async function handler(
  req: IRequest,
  res: NextApiResponse<IDefaultPostResponse>,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ ok: false, message: 'Only POST requests allowed' });
    return;
  }

  const { id, nickname, semester, major, grade, totalGrades, timetables } =
    req.body;

  try {
    await client.timetables.create({
      data: {
        id,
        nickname,
        semester,
        major,
        grade,
        totalGrades,
        timetables: JSON.stringify(timetables),
      },
    });
    res.status(200).json({ ok: true, message: '저장 완료' });
  } catch (e) {
    res
      .status(202)
      .json({ ok: false, message: '저장 실패 - 데이터베이스 오류' });
  }
}
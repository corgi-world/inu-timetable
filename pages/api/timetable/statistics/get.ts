import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/prisma/client';
import type { IUserTimetablesResponse } from '@/types/apiResponse';
import { Timetables } from '@prisma/client';
import type { ITimetable } from '@/types/timetable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserTimetablesResponse>,
) {
  const { semester, college, major, grade } = req.query;
  if (!semester || !college || !major || !grade) {
    res
      .status(200)
      .json({ ok: false, message: '불러오기 실패 - query string 오류' });
    return;
  }

  try {
    const result = await client.timetables.findMany({
      where: {
        AND: {
          semester: {
            equals: semester as string,
          },
          college: isAll(college)
            ? undefined
            : {
                equals: college as string,
              },
          major: isAll(major)
            ? undefined
            : {
                equals: major as string,
              },
          grade: isAll(grade)
            ? undefined
            : {
                equals: grade as string,
              },
        },
      },
      orderBy: {
        index: 'desc',
      },
      take: 500,
    });

    if (result) {
      const userTimetables = parseUserTimetablesObject(result);
      res
        .status(200)
        .json({ ok: true, message: '불러오기 완료', userTimetables });
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

function isAll(target: string | string[] | undefined) {
  return (target as string).includes('모든');
}

function parseUserTimetablesObject(result: Timetables[]) {
  const userTimetables = result.map(
    ({
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
    }) => {
      return {
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
    },
  );

  return userTimetables;
}

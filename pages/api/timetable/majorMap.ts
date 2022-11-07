import type { NextApiRequest, NextApiResponse } from 'next';
import { read } from '@/utils/json';
import { TypeMajorMap } from '@/types/timetable';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TypeMajorMap>,
) {
  const majorMap = read<TypeMajorMap>('majorMap');

  res.status(200).json(majorMap);
}

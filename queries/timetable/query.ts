import { useQuery } from '@tanstack/react-query';
import { get } from '../httpMethods';
import { majorMapService } from './services';
import type { TypeMajorMap } from '@/types/timetable';

export function useMajorMap() {
  const queryResult = useQuery<TypeMajorMap>(
    ['majorMap'],
    () => get(majorMapService),
    { staleTime: 60 * 1000 * 60 },
  );

  return queryResult;
}

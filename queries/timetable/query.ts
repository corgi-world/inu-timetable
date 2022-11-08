import { useQuery, useMutation } from '@tanstack/react-query';
import { get, post } from '../httpMethods';
import { majorMapService, userGetService, userPostService } from './services';
import type { IUserTimetable, TypeMajorMap } from '@/types/timetable';
import type {
  IDefaultPostResponse,
  IUserTimetableResponse,
} from '@/types/apiResponse';

export function useMajorMap() {
  const queryResult = useQuery<TypeMajorMap>(
    ['majorMap'],
    () => get(majorMapService),
    { staleTime: 60 * 1000 * 60 },
  );

  return queryResult;
}

export function useUserPostTimetables() {
  return useMutation((data: IUserTimetable) =>
    post<IDefaultPostResponse>(userPostService, data),
  );
}

export function useUserTimetable(id: string, semester: string) {
  const queryString = `?id=${id}&semester=${semester}`;

  const queryResult = useQuery<IUserTimetableResponse>(
    ['userTimetable', id, semester],
    () => get(userGetService, queryString),
    { staleTime: 60 * 1000 * 60 },
  );

  return queryResult;
}

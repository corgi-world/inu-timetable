import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useUserPostTimetable() {
  const { mutateAsync } = useMutation((userTimetable: IUserTimetable) =>
    post<IDefaultPostResponse>(userPostService, userTimetable),
  );

  const queryClient = useQueryClient();
  return async (userTimetable: IUserTimetable) => {
    const { id, semester } = userTimetable;
    await queryClient.invalidateQueries({
      queryKey: ['userTimetable', id, semester],
    });

    return await mutateAsync(userTimetable);
  };
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

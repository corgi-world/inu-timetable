import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { get, post, _delete } from '../httpMethods';
import {
  feedGetService,
  majorMapService,
  statisticsGetService,
  userDeleteService,
  userGetService,
  userPostService,
} from './services';
import type { IUserTimetable, TypeMajorMap } from '@/types/timetable';
import type {
  IDefaultPostResponse,
  IDefaultDeleteResponse,
  IUserTimetableResponse,
  IUserTimetablesResponse,
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
    await invalidateUserTimetable(queryClient, id, semester);
    removeStatisticsQueries(queryClient, semester);

    return await mutateAsync(userTimetable);
  };
}

export function useUserDeleteTimetable() {
  const { mutateAsync } = useMutation(
    ({ id, semester }: { id: string; semester: string }) => {
      const queryString = `?id=${id}&semester=${semester}`;

      return _delete<IDefaultDeleteResponse>(userDeleteService, queryString);
    },
  );

  const queryClient = useQueryClient();
  return async (id: string, semester: string) => {
    await invalidateUserTimetable(queryClient, id, semester);
    removeStatisticsQueries(queryClient, semester);

    return await mutateAsync({ id, semester });
  };
}

async function invalidateUserTimetable(
  queryClient: QueryClient,
  id: string,
  semester: string,
) {
  await queryClient.invalidateQueries({
    queryKey: ['userTimetable', id, semester],
  });
}

function removeStatisticsQueries(queryClient: QueryClient, semester: string) {
  queryClient.removeQueries({
    queryKey: ['statistics', semester],
  });
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

export function useStatisticsTimetables(
  semester: string,
  college: string,
  major: string,
  grade: string,
) {
  const queryString = `?semester=${semester}&college=${college}&major=${major}&grade=${grade}`;

  const queryResult = useQuery<IUserTimetablesResponse>(
    ['statistics', semester, college, major, grade],
    () => get(statisticsGetService, queryString),
    { staleTime: 60 * 1000 * 60, enabled: false, keepPreviousData: true },
  );

  return queryResult;
}

export function useFeedTimetables(
  semester: string,
  college: string,
  major: string,
  grade: string,
) {
  const queryString = `?semester=${semester}&college=${college}&major=${major}&grade=${grade}`;

  const queryResult = useInfiniteQuery<IUserTimetablesResponse>(
    ['feed', semester, college, major, grade],
    ({ pageParam = 0 }) =>
      get(feedGetService, `${queryString}&index=${pageParam}`),
    {
      getNextPageParam: ({ userTimetables }) =>
        userTimetables
          ? userTimetables[userTimetables.length - 1].index
          : undefined,
      refetchOnWindowFocus: false,
    },
  );

  return queryResult;
}

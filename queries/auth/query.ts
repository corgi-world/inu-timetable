import { useMutation } from '@tanstack/react-query';
import { post } from '../httpMethods';
import { signupService } from './services';
import type { IUser } from '@/types/auth';
import type { IDefaultPostResponse } from '@/types/apiResponse';

export function useSignup() {
  return useMutation((data: IUser) =>
    post<IDefaultPostResponse>(signupService, data),
  );
}

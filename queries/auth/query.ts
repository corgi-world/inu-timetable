import { useMutation } from '@tanstack/react-query';
import { post } from '../httpMethods';
import { signupService } from './services';
import { IUser } from '@/types/auth';

export function useSignup() {
  return useMutation((data: IUser) => post(signupService, data));
}

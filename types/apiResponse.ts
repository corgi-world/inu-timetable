import { IUserTimetable } from './timetable';

export interface IDefaultPostResponse {
  ok: boolean;
  message: string;
}

export interface IUserTimetableResponse {
  ok: boolean;
  message?: string;
  userTimetable?: IUserTimetable;
}

import { IUserTimetable } from './timetable';

interface IDefaultResponse {
  ok: boolean;
  message: string;
}

export interface IDefaultPostResponse {
  ok: boolean;
  message: string;
}

export interface IDefaultDeleteResponse {
  ok: boolean;
  message: string;
}

export interface IUserTimetableResponse extends IDefaultResponse {
  userTimetable?: IUserTimetable;
}

export interface IUserTimetablesResponse extends IDefaultResponse {
  userTimetables?: IUserTimetable[];
}

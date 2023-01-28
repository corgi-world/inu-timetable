type TypeDay = '월' | '화' | '수' | '목' | '금';
export interface ISchedule {
  day: TypeDay;
  startHour: number;
  startMinute: number;
  workingMinutes: number;
}

export interface ITimetable {
  classNumber: string;
  category: string;
  name: string;
  professor: string | null;
  schedules: ISchedule[] | null;
  isELerning: boolean;
  grades: number;
  colorIndex: number | undefined;
}

export type TypeColleges =
  | '인문대학'
  | '자연과학대학'
  | '사회과학대학'
  | '글로벌정경대학'
  | '공과대학'
  | '정보기술대학'
  | '경영대학'
  | '예술체육대학'
  | '사범대학'
  | '도시과학대학'
  | '생명과학기술대학'
  | '동북아국제통상학부'
  | '법학부';
export type TypeMajorMap = {
  [key in TypeColleges]: string[];
};

export interface IUserTimetable {
  index: number;
  id: string;
  nickname: string;
  semester: string;
  college: string;
  major: string;
  grade: string;
  totalGrades: number;
  timetables: ITimetable[];
  likeUsers: string[];
}

type typeDay = '월' | '화' | '수' | '목' | '금';
export interface ISchedule {
  day: typeDay;
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

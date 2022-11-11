export interface ISubjectCountMap {
  [key: string]: number;
}
export interface ITableData {
  subjectNames: string[];
  subjectCountMap: ISubjectCountMap;
}

export interface ITotalGradesCountMap {
  [key: number]: number;
}
export interface IChartProps {
  categories: string[];
  data: number[];
}

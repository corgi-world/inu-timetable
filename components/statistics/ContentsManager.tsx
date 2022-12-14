import React, { useMemo } from 'react';
import type { IUserTimetable } from '@/types/timetable';
import type {
  ITableData,
  IChartProps,
  ISubjectCountMap,
  ITotalGradesCountMap,
} from '@/types/statistics';
import styled from 'styled-components';
import SubjectCountTable from './SubjectCountTable';
import TotalGradesChart from './TotalGradesChart';

interface IContentsManager {
  userTimetables: IUserTimetable[];
}

export default function ContentsManager({ userTimetables }: IContentsManager) {
  const { subjectNames, subjectCountMap } = useMemo<ITableData>(
    () => calculateTableData(userTimetables),
    [],
  );

  const { categories, data } = useMemo<IChartProps>(
    () => calculateChartProps(userTimetables),
    [],
  );

  const renderContents = () => {
    const length = subjectNames.length;
    if (0 < length) {
      return (
        <>
          <SubjectCountTable
            subjectNames={subjectNames}
            subjectCountMap={subjectCountMap}
          />
          <ChartWrapper>
            <TotalGradesChart categories={categories} data={data} />
          </ChartWrapper>
        </>
      );
    } else {
      return <>저장된 데이터가 없습니다.</>;
    }
  };

  return <Wrapper>{renderContents()}</Wrapper>;
}

function calculateTableData(userTimetables: IUserTimetable[]) {
  const subjectCountMap: ISubjectCountMap = {};

  for (const { timetables } of userTimetables) {
    for (const { name } of timetables) {
      if (subjectCountMap[name]) subjectCountMap[name] += 1;
      else subjectCountMap[name] = 1;
    }
  }

  const subjectNames = Object.keys(subjectCountMap);
  const sortedSubjectNames = subjectNames.sort((a, b) => {
    return subjectCountMap[a] < subjectCountMap[b] ? 1 : -1;
  });

  const length = sortedSubjectNames.length;
  const MAX_COUNT = 30;
  const filteredSubjectNames =
    MAX_COUNT < length
      ? sortedSubjectNames.slice(0, MAX_COUNT)
      : sortedSubjectNames;

  return { subjectNames: filteredSubjectNames, subjectCountMap };
}

function calculateChartProps(userTimetables: IUserTimetable[]) {
  const totalGradesCountMap = userTimetables.reduce<ITotalGradesCountMap>(
    (prev, { totalGrades }) => {
      if (prev[totalGrades]) prev[totalGrades] += 1;
      else prev[totalGrades] = 1;
      return prev;
    },
    {},
  );

  const gradesList = Object.keys(totalGradesCountMap);
  const sortedGrades = gradesList.sort((a, b) => {
    return totalGradesCountMap[+a] < totalGradesCountMap[+b] ? 1 : -1;
  });

  const length = sortedGrades.length;
  const MAX_COUNT = 7;
  const filteredGradesList =
    MAX_COUNT < length ? sortedGrades.slice(0, MAX_COUNT) : sortedGrades;

  const categories = filteredGradesList.map((grades) => `${grades}학점`);
  const data = filteredGradesList.map((grades) => totalGradesCountMap[+grades]);

  return { categories, data };
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartWrapper = styled.div`
  width: 100%;
`;

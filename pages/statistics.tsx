import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TypeColleges, TypeMajorMap } from '@/types/timetable';
import { GRADES } from '@/consts/timetable';
import ConditionSelector from '@/components/main/ConditionSelector';
import { useStatisticsTimetables } from '@/queries/timetable/query';
import CircularProgress from '@mui/material/CircularProgress';

interface IStatistics {
  semesters: string[];
  majorMap: TypeMajorMap;
}

export default function Statistics({ semesters, majorMap }: IStatistics) {
  const {
    semester,
    setSemester,
    colleges,
    college,
    setCollege,
    majors,
    major,
    setMajor,
    grades,
    grade,
    setGrade,
  } = useCondition(semesters, majorMap);

  const { isFetching, data, refetch } = useStatisticsTimetables(
    semester,
    college,
    major,
    grade,
  );

  const handleSearch = () => {
    refetch();
  };

  console.log(isFetching, data);

  return (
    <Wrapper>
      <ContentsWrapper>
        <ConditionSelector
          semesters={semesters}
          semester={semester}
          setSemester={setSemester}
          colleges={colleges}
          college={college}
          setCollege={setCollege}
          majors={majors}
          major={major}
          setMajor={setMajor}
          grades={grades}
          grade={grade}
          setGrade={setGrade}
          handleSearch={handleSearch}
        />
      </ContentsWrapper>
      <Main>
        {isFetching ? (
          <SpinnerWrapper>
            <CircularProgress size={60} />
          </SpinnerWrapper>
        ) : (
          <ChartWrapper>Hello</ChartWrapper>
        )}
      </Main>
    </Wrapper>
  );
}

function useCondition(semesters: string[], majorMap: TypeMajorMap) {
  const [semester, setSemester] = useState(semesters[0]);

  const colleges = ['모든 단과대학', ...Object.keys(majorMap)];
  const [college, setCollege] = useState(colleges[0]);

  const majors =
    college === colleges[0]
      ? ['모든 과']
      : ['모든 과', ...majorMap[college as TypeColleges]];
  const [major, setMajor] = useState(majors[0]);

  const grades = ['모든 학년', ...GRADES];
  const [grade, setGrade] = useState(grades[0]);

  useEffect(() => {
    setMajor(majors[0]);
  }, [college]);

  return {
    semester,
    setSemester,
    colleges,
    college,
    setCollege,
    majors,
    major,
    setMajor,
    grades,
    grade,
    setGrade,
  };
}

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ContentsWrapper = styled.div`
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 950px;
  }

  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpinnerWrapper = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
`;

const ChartWrapper = styled.div`
  display: flex;
`;

import Layout from '@/components/Layout';
Statistics.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

import { read } from '@/utils/json';
export async function getStaticProps() {
  const semesters = read<string[]>('semesters');
  const majorMap = read<TypeMajorMap>('majorMap');

  return { props: { semesters, majorMap } };
}

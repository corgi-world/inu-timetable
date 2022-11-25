import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type {
  IUserTimetable,
  TypeColleges,
  TypeMajorMap,
} from '@/types/timetable';
import { GRADES } from '@/consts/timetable';
import ConditionSelector from '@/components/main/ConditionSelector';
import { useFeedTimetables } from '@/queries/timetable/query';
import CircularProgress from '@mui/material/CircularProgress';
import ContentsManager from '@/components/home/ContentsManager';
import IntersectObserver from '@/components/main/IntersectObserver';

interface IStatistics {
  semesters: string[];
  majorMap: TypeMajorMap;
}

export default function Home({ semesters, majorMap }: IStatistics) {
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

  const { isFetching, data, hasNextPage, fetchNextPage } = useFeedTimetables(
    semester,
    college,
    major,
    grade,
  );

  const handleInView = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderMainContents = () => {
    if (data && data?.pages) {
      const userTimetables = data?.pages.reduce<IUserTimetable[]>(
        (prev, { userTimetables }) => {
          if (userTimetables) prev.push(...userTimetables);
          return prev;
        },
        [],
      );
      return <ContentsManager userTimetables={userTimetables} />;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = () => {
    window.removeEventListener('scroll', handleScroll);

    setIsScrolled(true);
  };

  return (
    <Wrapper>
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
        needSearchButton={false}
      />
      <Main>
        {renderMainContents()}
        {isFetching && (
          <SpinnerWrapper>
            <CircularProgress size={60} />
          </SpinnerWrapper>
        )}
        {!isFetching && hasNextPage && isScrolled && (
          <IntersectObserver handleInView={handleInView} />
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
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    width: 950px;
  }
  margin: 0 auto;
`;

const Main = styled.main`
  padding: 10px;
  margin-top: 10px;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    margin-top: 20px;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpinnerWrapper = styled.div`
  height: 40vh;
  display: flex;
  align-items: center;
`;

import Layout from '@/components/Layout';
Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

import { read } from '@/utils/json';
export async function getStaticProps() {
  const semesters = read<string[]>('semesters');
  const majorMap = read<TypeMajorMap>('majorMap');

  return { props: { semesters, majorMap } };
}

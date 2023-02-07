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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface IStatistics {
  semesters: string[];
  majorMap: TypeMajorMap;
}

const ORDER_TIME = '최신순';
const ORDER_LIKE = '좋아요순';
type TypeOrder = typeof ORDER_TIME | typeof ORDER_LIKE;

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

  const [order, setOrder] = useState<TypeOrder>(ORDER_TIME);
  const handleOrderChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    if ((value && value === ORDER_TIME) || value === ORDER_LIKE) {
      setOrder(value);
    }
  };

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

  const handleLikeClick = (index: number) => {
    console.log(index);
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
      return (
        <ContentsManager
          userTimetables={userTimetables}
          handleLikeClick={handleLikeClick}
        />
      );
    }
  };

  return (
    <Wrapper>
      <ConditionWrapper>
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
        <StyledToggleButtonGroup
          color='primary'
          value={order}
          sx={{ height: '39px' }}
          exclusive
          onChange={handleOrderChange}
        >
          <ToggleButton value={ORDER_TIME}>{ORDER_TIME}</ToggleButton>
          <ToggleButton value={ORDER_LIKE}>{ORDER_LIKE}</ToggleButton>
        </StyledToggleButtonGroup>
      </ConditionWrapper>
      <Main>
        {renderMainContents()}
        {isFetching && (
          <SpinnerWrapper>
            <CircularProgress size={60} />
          </SpinnerWrapper>
        )}
        {!isFetching && hasNextPage && (
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

const ConditionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    padding-right: 0px;
  }
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

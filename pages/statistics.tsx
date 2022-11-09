import React from 'react';
import styled from 'styled-components';
import type { TypeMajorMap } from '@/types/timetable';

interface IStatistics {
  semesters: string[];
  majorMap: TypeMajorMap;
}

export default function Statistics({ semesters, majorMap }: IStatistics) {
  const handleSearch = (
    semester: string,
    college: string,
    major: string,
    grade: string,
  ) => {
    console.log(semester, college, major, grade);
  };

  return (
    <Wrapper>
      <ContentsWrapper>
        <ConditionSelector
          semesters={semesters}
          majorMap={majorMap}
          handleSearch={handleSearch}
        />
      </ContentsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const ContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 950px;
  }

  display: flex;
  flex-direction: column;
`;

import Layout from '@/components/Layout';
Statistics.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

import { read } from '@/utils/json';
import ConditionSelector from '@/components/main/ConditionSelector';
export async function getStaticProps() {
  const semesters = read<string[]>('semesters');
  const majorMap = read<TypeMajorMap>('majorMap');

  return { props: { semesters, majorMap } };
}

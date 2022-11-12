import React from 'react';
import type { ITimetable } from '@/types/timetable';
import styled from 'styled-components';
import Viewer from '@/components/timetable/viewer';

interface IFeed {
  timetables: ITimetable[];
  major: string;
  nickname: string;
  totalGrades: number;
}

export default function Feed({
  timetables,
  major,
  nickname,
  totalGrades,
}: IFeed) {
  return (
    <Wrapper>
      <InfoWrapper>
        <p>{major}</p>
        <p>{nickname}</p>
        <p>{`총 ${totalGrades}학점`}</p>
      </InfoWrapper>
      <Viewer fullMode={false} timetables={timetables} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

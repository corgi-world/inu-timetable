import React from 'react';
import type { IUserTimetable } from '@/types/timetable';
import styled from 'styled-components';
import Feed from './Feed';

interface IContentsManager {
  userTimetables: IUserTimetable[];
}

export default function ContentsManager({ userTimetables }: IContentsManager) {
  const length = userTimetables.length;
  return (
    <Wrapper>
      {0 < length ? (
        userTimetables.map(
          ({
            id,
            semester,
            timetables,
            major,
            grade,
            nickname,
            totalGrades,
          }) => (
            <Feed
              key={`${id}${semester}`}
              timetables={timetables}
              major={major}
              grade={grade}
              nickname={nickname}
              totalGrades={totalGrades}
            />
          ),
        )
      ) : (
        <>저장된 데이터가 없습니다.</>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    width: 380px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

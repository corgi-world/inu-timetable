import React from 'react';
import type { IUserTimetable } from '@/types/timetable';
import styled from 'styled-components';
import Feed from './Feed';

interface IContentsManager {
  userTimetables: IUserTimetable[];
  handleLikeClick: (index: number) => void;
}

export default function ContentsManager({
  userTimetables,
  handleLikeClick,
}: IContentsManager) {
  const length = userTimetables.length;

  return (
    <Wrapper>
      {0 < length ? (
        userTimetables.map(
          ({
            index,
            id,
            semester,
            timetables,
            major,
            grade,
            nickname,
            totalGrades,
            likeUsers,
          }) => (
            <Feed
              key={`${id}${semester}`}
              index={index}
              timetables={timetables}
              major={major}
              grade={grade}
              nickname={nickname}
              totalGrades={totalGrades}
              likeUsers={likeUsers}
              handleLikeClick={handleLikeClick}
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

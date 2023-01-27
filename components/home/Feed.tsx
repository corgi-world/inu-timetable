import React from 'react';
import type { ITimetable } from '@/types/timetable';
import styled from 'styled-components';
import Viewer from '@/components/timetable/viewer';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';

interface IFeed {
  timetables: ITimetable[];
  major: string;
  grade: string;
  nickname: string;
  totalGrades: number;
}

export default function Feed({
  timetables,
  major,
  grade,
  nickname,
  totalGrades,
}: IFeed) {
  const like = 30;
  const isLiked = false;

  return (
    <Wrapper>
      <InfoWrapper>
        <Text>{`${major} ${grade} - ${nickname}`}</Text>
        <Text>{`${totalGrades}학점`}</Text>
      </InfoWrapper>
      <Viewer fullMode={false} timetables={timetables} />
      <LikeWrapper>
        <IconWrapper
          onClick={() => {
            console.log('dd');
          }}
        >
          {isLiked ? <FcLike size='40' /> : <FcLikePlaceholder size='40' />}
        </IconWrapper>
        {`좋아요 ${like}개`}
      </LikeWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Text = styled.p`
  font-weight: 600;
`;

const LikeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

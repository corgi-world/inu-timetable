import React from 'react';
import type { ITimetable } from '@/types/timetable';
import styled from 'styled-components';
import Viewer from '@/components/timetable/viewer';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';

interface IFeed {
  index: number;
  timetables: ITimetable[];
  major: string;
  grade: string;
  nickname: string;
  totalGrades: number;
  likeUsers: string[];
  handleLikeClick: (index: number) => void;
}

export default function Feed({
  index,
  timetables,
  major,
  grade,
  nickname,
  totalGrades,
  likeUsers,
  handleLikeClick,
}: IFeed) {
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
            handleLikeClick(index);
          }}
        >
          {isLiked ? <FcLike size='40' /> : <FcLikePlaceholder size='40' />}
        </IconWrapper>
        {`좋아요 ${likeUsers.length}개`}
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

  display: none;
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;

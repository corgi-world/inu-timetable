import React, { useState } from 'react';
import styled from 'styled-components';
import Select from '@/components/MuiSelect';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useUserTimetable } from '@/queries/timetable/query';
import CircularProgress from '@mui/material/CircularProgress';

interface IMypage {
  semesters: string[];
  user: {
    name: string;
    email: string;
  };
}

export default function Mypage({ semesters, user }: IMypage) {
  const [semester, setSemester] = useState(semesters[0]);
  const handleSemesterChange = (semester: string) => {
    setSemester(semester);
  };

  const { email: id } = user;
  const { data, isLoading } = useUserTimetable(id, semester);
  const userTimetable = data?.userTimetable;

  const getOperaionButton = () => {
    if (isLoading) return <></>;

    if (userTimetable) {
      return (
        <ButtonWrapper>
          <Button variant='outlined' color='error'>
            삭제
          </Button>
        </ButtonWrapper>
      );
    } else {
      return (
        <ButtonWrapper>
          <Link href={`/my/add/${semester}`}>
            <Button variant='outlined'>시간표 추가</Button>
          </Link>
        </ButtonWrapper>
      );
    }
  };

  const getViewer = () => {
    if (isLoading) {
      return (
        <SpinnerWrapper>
          <CircularProgress size={60} />
        </SpinnerWrapper>
      );
    }

    if (userTimetable) {
      const timetables = userTimetable.timetables;
      return (
        <ViewerWrapper>
          <Viewer timetables={timetables} />
        </ViewerWrapper>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Wrapper>
      <ContentsWrapper>
        <OperationWrapper>
          <Select
            items={semesters}
            value={semester}
            onChange={handleSemesterChange}
          />
          {getOperaionButton()}
        </OperationWrapper>
        <Main>{getViewer()}</Main>
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

const OperationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SpinnerWrapper = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
`;

const ViewerWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 380px;
  }
`;

import Layout from '@/components/Layout';
Mypage.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

import { redirectNotAuthUser } from '@/utils/auth';
import { NextPageContext } from 'next';
import { read } from '@/utils/json';
import Viewer from '@/components/timetable/viewer';

export async function getServerSideProps(context: NextPageContext) {
  const { user, redirect } = await redirectNotAuthUser(context.req);
  if (!user) {
    return { redirect };
  }

  const semesters = read<string[]>('semesters');

  return { props: { semesters, user } };
}

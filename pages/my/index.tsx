import React, { useState } from 'react';
import styled from 'styled-components';
import Select from '@/components/MuiSelect';
import Button from '@mui/material/Button';

interface IMypage {
  semesters: string[];
}

export default function Mypage({ semesters }: IMypage) {
  const [semester, setSemester] = useState(semesters[0]);
  const handleSemesterChange = (semester: string) => {
    setSemester(semester);
  };

  const hasTimetable = false;
  return (
    <Wrapper>
      <Main>
        <OperationWrapper>
          <Select
            items={semesters}
            value={semester}
            onChange={handleSemesterChange}
          />
          {hasTimetable ? (
            <ButtonWrapper>
              <Button variant='outlined'>수정</Button>
              <Button variant='outlined' color='error'>
                삭제
              </Button>
            </ButtonWrapper>
          ) : (
            <ButtonWrapper>
              <Button variant='outlined'>시간표 추가</Button>
            </ButtonWrapper>
          )}
        </OperationWrapper>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme: { color } }) => color.background};
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const Main = styled.main`
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 950px;
  }

  display: flex;
  justify-content: center;
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

import Layout from '@/components/Layout';
Mypage.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

import { redirectNotAuthUser } from '@/utils/auth';
import { NextPageContext } from 'next';

import fs from 'fs';
import path from 'path';

export async function getServerSideProps(context: NextPageContext) {
  const redirectObject = await redirectNotAuthUser(context.req);
  if (redirectObject.redirect) {
    return redirectObject;
  }

  const folderPath = path.join(process.cwd(), '/public/json');
  const fileData = fs.readFileSync(`${folderPath}/semesters.json`, 'utf-8');
  const semesters = JSON.parse(fileData) as string[];

  return { props: { semesters } };
}

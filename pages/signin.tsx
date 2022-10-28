import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Link from 'next/link';

const signin: NextPage = () => {
  return (
    <Wrapper>
      <Main>
        <Form>
          <StyledTextField
            size='small'
            autoComplete='off'
            placeholder={'ID'}
            error={false}
            helperText={''}
          />
          <StyledTextField
            size='small'
            type={'password'}
            autoComplete='off'
            placeholder={'Password'}
            error={false}
            helperText={''}
          />
          <SigninButton isValidated={false} disabled={true}>
            로그인
          </SigninButton>
        </Form>
        <SignupWrapper>
          <p>계정이 없으신가요?</p>
          <Link href='/signup'>
            <SignupLink>가입하기</SignupLink>
          </Link>
        </SignupWrapper>
      </Main>
    </Wrapper>
  );
};

export default signin;

const Wrapper = styled.div`
  background-color: ${({ theme: { color } }) => color.background};
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 350px;
  height: 350px;
  padding: 30px;
  border: 1px solid #d6d6d6;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const SigninButton = styled.button<{ isValidated: boolean }>`
  width: 100%;
  height: 38px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 10px;
  color: white;
  background-color: ${(props) => (props.isValidated ? '#0094f6' : '#b2defc')};
  text-align: center;
  cursor: ${(props) => (props.isValidated ? 'pointer' : 'default')};
`;

const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 55px;
`;

const SignupLink = styled.p`
  color: #0094f6;
  font-weight: 600;
  cursor: pointer;
`;

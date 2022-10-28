import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Link from 'next/link';

export default function signup() {
  return (
    <Wrapper>
      <Main>
        <Form>
          <StyledTextField
            size='small'
            autoComplete='off'
            placeholder={'아이디'}
            error={false}
            helperText={''}
          />
          <StyledTextField
            size='small'
            autoComplete='off'
            placeholder={'닉네임'}
            error={false}
            helperText={''}
          />
          <StyledTextField
            size='small'
            type={'password'}
            autoComplete='off'
            placeholder={'비밀번호'}
            error={false}
            helperText={''}
          />
          <StyledTextField
            size='small'
            type={'password'}
            autoComplete='off'
            placeholder={'비밀번호 확인'}
            error={false}
            helperText={''}
          />
          <SignupButton isValidated={false} disabled={true}>
            회원가입
          </SignupButton>
        </Form>
        <SignupWrapper>
          <p>계정이 있으신가요?</p>
          <Link href='/signin'>
            <SignupLink>로그인하기</SignupLink>
          </Link>
        </SignupWrapper>
      </Main>
    </Wrapper>
  );
}

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

const SignupButton = styled.button<{ isValidated: boolean }>`
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

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useAlert, CommonAlert } from '@/components/CommonAlert';

const signin: NextPage = () => {
  const [id, setID] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  const isAvailable = !!(id && password);

  const { alertState, openAlert, closeAlert } = useAlert();

  const router = useRouter();

  useEffect(() => {
    const { isSignup, message } = router.query;
    if (isSignup) {
      const isError = false;
      openAlert(isError, message as string);
    }
  }, []);

  return (
    <Wrapper>
      <Main>
        <Form onSubmit={handleSubmit}>
          <StyledTextField
            size='small'
            autoComplete='off'
            placeholder={'아이디'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setID(e.target.value);
            }}
          />
          <StyledTextField
            size='small'
            autoComplete='off'
            placeholder={'비밀번호'}
            type={'password'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <SigninButton isAvailable={isAvailable} disabled={!isAvailable}>
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
      <CommonAlert
        isOpen={alertState.isOpen}
        isError={alertState.isError}
        message={alertState.message}
        handleClose={() => closeAlert()}
      />
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

const SigninButton = styled.button<{ isAvailable: boolean }>`
  width: 100%;
  height: 38px;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 5px;
  margin-top: 10px;
  color: white;
  background-color: ${(props) => (props.isAvailable ? '#0094f6' : '#b2defc')};
  text-align: center;
  cursor: ${(props) => (props.isAvailable ? 'pointer' : 'default')};
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

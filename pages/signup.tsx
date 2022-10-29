import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import {
  ID_VALIDATION,
  NICKNAME_VALIDATION,
  PASSWORD_VALIDATION,
} from '@/utils/validation';
import { useForm, SubmitHandler, UseFormGetValues } from 'react-hook-form';

interface ISignupData {
  [key: string]: string;
  id: string;
  nickname: string;
  password: string;
}

interface ISignupFormData extends ISignupData {
  passwordCheck: string;
}

const signup: NextPage = () => {
  const {
    getValues,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupFormData>();

  const INPUTS = getInputs(getValues);

  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    const subscription = watch((formData) => {
      const isEmptyValue =
        Object.values(formData).filter((value) => value === '').length > 0;
      setIsAvailable(!isEmptyValue);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleValid: SubmitHandler<ISignupFormData> = (formData) => {
    console.log(formData);
  };

  return (
    <Wrapper>
      <Main>
        <Form onSubmit={handleSubmit(handleValid)}>
          {INPUTS.map(({ key, placeholder, option }) => {
            return (
              <StyledTextField
                {...register(
                  key as 'id' | 'passwordCheck' | 'nickname' | 'password',
                  option,
                )}
                key={key}
                type={key.includes('password') ? 'password' : undefined}
                size='small'
                autoComplete='off'
                placeholder={placeholder}
                error={!!errors[key]}
                helperText={errors[key]?.message}
              />
            );
          })}
          <SignupButton isAvailable={isAvailable} disabled={!isAvailable}>
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
};

export default signup;

function getInputs(getValues: UseFormGetValues<ISignupFormData>) {
  const INPUTS = [
    {
      key: 'id',
      placeholder: '아이디',
      option: {
        required: true,
        pattern: {
          value: ID_VALIDATION,
          message: '4~12자의 영문과 숫자만 입력 가능합니다.',
        },
      },
    },
    {
      key: 'nickname',
      placeholder: '닉네임',
      option: {
        required: true,
        pattern: {
          value: NICKNAME_VALIDATION,
          message: '2~8자의 한글과 영문, 숫자만 입력 가능합니다.',
        },
      },
    },
    {
      key: 'password',
      placeholder: '비밀번호',
      option: {
        required: true,
        pattern: {
          value: PASSWORD_VALIDATION,
          message: '6~12자의 영문과 숫자만 입력 가능합니다.',
        },
      },
    },
    {
      key: 'passwordCheck',
      placeholder: '비밀번호 확인',
      option: {
        required: true,
        pattern: {
          value: PASSWORD_VALIDATION,
          message: '6~12자의 영문과 숫자만 입력 가능합니다.',
        },
        validate: {
          check: (v: string) =>
            v === getValues('password') || '동일한 비밀번호를 입력해주세요.',
        },
      },
    },
  ];

  return INPUTS;
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

const SignupButton = styled.button<{ isAvailable: boolean }>`
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

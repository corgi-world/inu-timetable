import type { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
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
import { useSignup } from '@/queries/auth/query';
import { useAlert, CommonAlert } from '@/components/CommonAlert';

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
  const { alertState, openAlert, closeAlert } = useAlert();

  const { mutateAsync } = useSignup();

  const router = useRouter();

  useEffect(() => {
    const subscription = watch((formData) => {
      const isEmptyValue =
        Object.values(formData).filter((value) => value === '').length > 0;
      setIsAvailable(!isEmptyValue);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleValid: SubmitHandler<ISignupFormData> = async ({
    id,
    nickname,
    password,
  }) => {
    setIsAvailable(false);

    const user = {
      id,
      nickname,
      password,
    };
    const {
      data: { ok, message },
    } = await mutateAsync(user);

    if (ok) {
      router.push({ pathname: '/signin', query: { message, isError: false } });
    } else {
      const isError = !ok;
      openAlert(isError, message);
    }
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
            ????????????
          </SignupButton>
        </Form>
        <SignupWrapper>
          <p>????????? ????????????????</p>
          <Link href='/signin'>
            <SignupLink>???????????????</SignupLink>
          </Link>
        </SignupWrapper>
      </Main>
      <CommonAlert
        isOpen={alertState.isOpen}
        isError={alertState.isError}
        message={alertState.message ?? ''}
        handleClose={() => {
          closeAlert(() => setIsAvailable(true));
        }}
      />
    </Wrapper>
  );
};

export default signup;

function getInputs(getValues: UseFormGetValues<ISignupFormData>) {
  const INPUTS = [
    {
      key: 'id',
      placeholder: '?????????',
      option: {
        required: true,
        pattern: {
          value: ID_VALIDATION,
          message: '4~12?????? ????????? ????????? ?????? ???????????????.',
        },
      },
    },
    {
      key: 'nickname',
      placeholder: '?????????',
      option: {
        required: true,
        pattern: {
          value: NICKNAME_VALIDATION,
          message: '2~8?????? ????????? ??????, ????????? ?????? ???????????????.',
        },
      },
    },
    {
      key: 'password',
      placeholder: '????????????',
      option: {
        required: true,
        pattern: {
          value: PASSWORD_VALIDATION,
          message: '6~12?????? ????????? ????????? ?????? ???????????????.',
        },
      },
    },
    {
      key: 'passwordCheck',
      placeholder: '???????????? ??????',
      option: {
        required: true,
        pattern: {
          value: PASSWORD_VALIDATION,
          message: '6~12?????? ????????? ????????? ?????? ???????????????.',
        },
        validate: {
          check: (v: string) =>
            v === getValues('password') || '????????? ??????????????? ??????????????????.',
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

import { redirectAuthUser } from '@/utils/auth';

export async function getServerSideProps(context: NextPageContext) {
  const returnObject = await redirectAuthUser(context.req);
  return returnObject;
}

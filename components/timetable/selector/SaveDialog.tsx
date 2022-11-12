import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TypeColleges, TypeMajorMap } from '@/types/timetable';
import Select from '@/components/MuiSelect';
import { GRADES } from '@/consts/timetable';
import Button from '@mui/material/Button';

interface ISaveDialog {
  majorMap: TypeMajorMap;
  handleClose: () => void;
  handleSave: (college: string, major: string, grade: string) => void;
}

export default function SaveDialog({
  majorMap,
  handleClose,
  handleSave,
}: ISaveDialog) {
  const {
    colleges,
    college,
    setCollege,
    majors,
    major,
    setMajor,
    grades,
    grade,
    setGrade,
  } = useMajor(majorMap);

  useEffect(() => {
    setMajor(majors[0]);
  }, [college]);

  return (
    <Wrapper>
      <Title>전공과 학년을 선택해주세요.</Title>
      <UserWrapper>
        <Select
          items={colleges}
          value={college}
          onChange={setCollege}
          fontSize={'14px'}
          width={'270px'}
        />
        <SelectWrapper>
          <Select
            items={majors}
            value={major}
            onChange={setMajor}
            fontSize={'14px'}
            width={'165px'}
          />
          <Select
            items={grades}
            value={grade}
            onChange={setGrade}
            fontSize={'14px'}
            width={'100px'}
          />
        </SelectWrapper>
      </UserWrapper>
      <ButtonWrapper>
        <StyledButton
          variant='outlined'
          color='error'
          onClick={() => handleClose()}
        >
          취소
        </StyledButton>
        <StyledButton
          variant='outlined'
          onClick={() => handleSave(college, major, grade)}
        >
          저장
        </StyledButton>
      </ButtonWrapper>
    </Wrapper>
  );
}

function useMajor(majorMap: TypeMajorMap) {
  const colleges = Object.keys(majorMap);
  const [college, setCollege] = useState(colleges[0]);

  const majors = majorMap[college as TypeColleges];
  const [major, setMajor] = useState(majors[0]);

  const grades = GRADES;
  const [grade, setGrade] = useState(grades[0]);

  return {
    colleges,
    college,
    setCollege,
    majors,
    major,
    setMajor,
    grades,
    grade,
    setGrade,
  };
}

const Wrapper = styled.div`
  background-color: ${({ theme: { color } }) => color.background};
  width: 310px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px 20px 30px 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 5px;
`;

const SelectWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 5px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

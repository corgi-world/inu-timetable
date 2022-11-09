import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TypeColleges, TypeMajorMap } from '@/types/timetable';
import Select from '@/components/MuiSelect';
import { GRADES } from '@/consts/timetable';
import Button from '@mui/material/Button';

interface IConditionSelector {
  semesters: string[];
  majorMap: TypeMajorMap;
  handleSearch: (
    semester: string,
    college: string,
    major: string,
    grade: string,
  ) => void;
}

export default function ConditionSelector({
  semesters,
  majorMap,
  handleSearch,
}: IConditionSelector) {
  const {
    semester,
    setSemester,
    colleges,
    college,
    setCollege,
    majors,
    major,
    setMajor,
    grades,
    grade,
    setGrade,
  } = useCondition(semesters, majorMap);

  return (
    <Wrapper>
      <SelectWrapper>
        <Select
          items={semesters}
          value={semester}
          onChange={setSemester}
          width={'100%'}
        />
        <Select
          items={colleges}
          value={college}
          onChange={setCollege}
          width={'100%'}
        />
        <Select
          items={majors}
          value={major}
          onChange={setMajor}
          width={'100%'}
        />
        <Select
          items={grades}
          value={grade}
          onChange={setGrade}
          width={'100%'}
        />
      </SelectWrapper>
      <ButtonWrapper>
        <StyledButton
          variant='contained'
          onClick={() => {
            handleSearch(semester, college, major, grade);
          }}
        >
          검색
        </StyledButton>
      </ButtonWrapper>
    </Wrapper>
  );
}

function useCondition(semesters: string[], majorMap: TypeMajorMap) {
  const [semester, setSemester] = useState(semesters[0]);

  const colleges = ['모든 단과대학', ...Object.keys(majorMap)];
  const [college, setCollege] = useState(colleges[0]);

  const majors =
    college === colleges[0]
      ? ['모든 과']
      : ['모든 과', ...majorMap[college as TypeColleges]];
  const [major, setMajor] = useState(majors[0]);

  const grades = ['모든 학년', ...GRADES];
  const [grade, setGrade] = useState(grades[0]);

  useEffect(() => {
    setMajor(majors[0]);
  }, [college]);

  return {
    semester,
    setSemester,
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
  display: flex;
  flex-direction: column;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    flex-direction: row;
    justify-content: space-between;
  }
  gap: 5px;
`;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    display: flex;
  }
  gap: 5px;
`;
const ButtonWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

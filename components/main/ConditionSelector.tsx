import React from 'react';
import styled from 'styled-components';
import Select from '@/components/MuiSelect';
import Button from '@mui/material/Button';

interface IConditionSelector {
  semesters: string[];
  semester: string;
  setSemester: React.Dispatch<React.SetStateAction<string>>;
  colleges: string[];
  college: string;
  setCollege: React.Dispatch<React.SetStateAction<string>>;
  majors: string[];
  major: string;
  setMajor: React.Dispatch<React.SetStateAction<string>>;
  grades: string[];
  grade: string;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  needSearchButton: boolean;
  handleSearch?: () => void;
}

export default function ConditionSelector({
  semesters,
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
  needSearchButton,
  handleSearch,
}: IConditionSelector) {
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
      {needSearchButton ? (
        <ButtonWrapper>
          <StyledButton
            variant='contained'
            onClick={() => {
              if (handleSearch) {
                handleSearch();
              }
            }}
          >
            검색
          </StyledButton>
        </ButtonWrapper>
      ) : (
        <></>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
    flex-direction: row;
    justify-content: space-between;
  }
  gap: 5px;
`;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
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

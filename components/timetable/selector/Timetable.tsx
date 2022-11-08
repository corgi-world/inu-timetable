import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';

interface ITimetableProps {
  name: string;
  professor: string | null;
  grades: number;
  schedules: string;
  index: number;
  isSelected: boolean;
  handleSelectTimetable: (index: number) => void;
  handleAddTimetable: () => void;
}

export default function Timetable({
  name,
  professor,
  grades,
  schedules,
  index,
  isSelected,
  handleSelectTimetable,
  handleAddTimetable,
}: ITimetableProps) {
  return (
    <Wrapper
      isSelected={isSelected}
      onClick={() => handleSelectTimetable(index)}
    >
      <InfoWrapper>
        <Name>
          {name} {`[${grades}학점]`}
        </Name>
        <p>{professor ? professor : ''}</p>
        <p>{schedules}</p>
      </InfoWrapper>
      {isSelected && (
        <Button
          variant='contained'
          size='medium'
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            handleAddTimetable();
          }}
        >
          추가
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isSelected: boolean }>`
  padding: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? 'lightgray' : 'white')};
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
`;

const Name = styled.h3`
  font-weight: 600;
`;

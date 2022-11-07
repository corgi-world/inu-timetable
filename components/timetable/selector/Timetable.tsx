import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';

interface ITimetable {
  name: string;
  professor: string | null;
  schedules: string;
  index: number;
  isSelected: boolean;
  handleSelectTimetable: (index: number) => void;
  handleAddTimetable: () => void;
}

export default function Timetable({
  name,
  professor,
  schedules,
  index,
  isSelected,
  handleSelectTimetable,
  handleAddTimetable,
}: ITimetable) {
  return (
    <Wrapper
      isSelected={isSelected}
      onClick={() => handleSelectTimetable(index)}
    >
      <InfoWrapper>
        <Name>{name}</Name>
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

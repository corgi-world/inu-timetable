import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';

interface ISubject {
  name: string;
  professor: string | null;
  schedules: string;
  index: number;
  isSelected: boolean;
  handleSelectSubject: (index: number) => void;
  handleAddSubject: () => void;
}

export default function Subject({
  name,
  professor,
  schedules,
  index,
  isSelected,
  handleSelectSubject,
  handleAddSubject,
}: ISubject) {
  return (
    <Wrapper isSelected={isSelected} onClick={() => handleSelectSubject(index)}>
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
            handleAddSubject();
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

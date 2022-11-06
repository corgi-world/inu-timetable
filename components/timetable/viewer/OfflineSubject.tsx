import React from 'react';

import styled from 'styled-components';

interface IOfflineSubject {
  classNumber: string;
  name: string;
  top: number;
  height: number;
  backgroundColor: string;
  isTempSubject: boolean;
  handleDeleteSubject?: (classNumber: string) => void;
}

export default function OfflineSubject({
  classNumber,
  name,
  top,
  height,
  backgroundColor,
  isTempSubject,
  handleDeleteSubject,
}: IOfflineSubject) {
  return (
    <Wrapper
      top={top}
      height={height}
      backgroundColor={backgroundColor}
      isTempSubject={isTempSubject}
      onClick={() => {
        if (isTempSubject) return;

        if (handleDeleteSubject !== undefined) {
          handleDeleteSubject(classNumber);
        }
      }}
    >
      {isTempSubject ? '' : name}
    </Wrapper>
  );
}

interface IWrapper {
  top: number;
  height: number;
  backgroundColor: string;
  isTempSubject: boolean;
}

const Wrapper = styled.div<IWrapper>`
  position: absolute;
  width: 100%;
  top: ${({ top }) => `${top}px`};
  height: ${({ height }) => `${height}px`};
  padding: 3px;
  border-bottom: 1px solid #d6d6d6;
  background-color: ${({ backgroundColor }) => backgroundColor};
  opacity: ${({ isTempSubject }) => (isTempSubject ? 0.5 : 1)};
  z-index: ${({ isTempSubject }) => (isTempSubject ? 2 : 1)};
  cursor: ${({ isTempSubject }) => (isTempSubject ? 'default' : 'pointer')};

  color: white;
  font-size: 13px;
`;

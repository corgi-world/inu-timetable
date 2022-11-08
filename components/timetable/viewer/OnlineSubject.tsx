import React from 'react';

import styled from 'styled-components';

interface IOnlineSubject {
  classNumber: string;
  name: string;
  handleDeleteTimetable?: (classNumber: string) => void;
}

export default function OnlineSubject({
  classNumber,
  name,
  handleDeleteTimetable,
}: IOnlineSubject) {
  return (
    <Wrapper
      onClick={() => {
        if (handleDeleteTimetable !== undefined) {
          handleDeleteTimetable(classNumber);
        }
      }}
    >
      {name}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-size: 13px;
  color: #a6a6a6;
  padding: 5px;
  cursor: pointer;

  border-top: 1px solid #d6d6d6;
  border-left: 1px solid #d6d6d6;
  border-right: 1px solid #d6d6d6;
`;

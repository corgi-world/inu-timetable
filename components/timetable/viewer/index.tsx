import React from 'react';
import styled from 'styled-components';
import OfflineSubject from './OfflineSubject';
import OnlineSubject from './OnlineSubject';
import type { ISchedule, ITimetable } from '@/types/timetable';
import {
  DAYS,
  HOURS,
  COLORS,
  CELL_HEIGHT,
  TEMP_COLOR_INDEX,
} from '@/consts/timetable';

interface IViewer {
  timetables: ITimetable[];
  handleDeleteTimetable?: (classNumber: string) => void;
}

export default function Viewer({ timetables, handleDeleteTimetable }: IViewer) {
  const { online, offline } = filterTimetablesByIsOnline(timetables);

  return (
    <Wrapper>
      {online.map(({ classNumber, name }) => (
        <OnlineSubject
          key={name}
          classNumber={classNumber}
          name={name}
          handleDeleteTimetable={handleDeleteTimetable}
        />
      ))}
      <Table>
        {DAYS.map((day) => (
          <ColumnHeader key={day}>{day}</ColumnHeader>
        ))}
        {HOURS.map((hour) => {
          return DAYS.map((day, index) =>
            index === 0 ? (
              <RowHeader key={day + hour}>
                {12 < hour ? hour - 12 : hour}
              </RowHeader>
            ) : (
              renderOfflineSubjects(day, hour, offline, handleDeleteTimetable)
            ),
          );
        })}
      </Table>
    </Wrapper>
  );
}

function filterTimetablesByIsOnline(timetables: ITimetable[]) {
  const onlineSubjects = timetables.filter(
    ({ isELerning, colorIndex }) =>
      isELerning && colorIndex !== undefined && TEMP_COLOR_INDEX < colorIndex,
  );
  const offlineSubjects = timetables.filter(({ isELerning }) => !isELerning);
  return { online: onlineSubjects, offline: offlineSubjects };
}

function renderOfflineSubjects(
  day: string,
  hour: number,
  subjects: ITimetable[],
  handleDeleteTimetable?: (classNumber: string) => void,
) {
  const foundSubjects = findSubjectByTime(day, hour, subjects);
  if (0 < foundSubjects.length) {
    const offlineSubjects = [];
    for (const foundSubject of foundSubjects) {
      const {
        classNumber,
        name,
        colorIndex,
        schedule: { startMinute, workingMinutes },
      } = foundSubject;
      const { top, height } = calcSubjectPosition(startMinute, workingMinutes);

      const color = COLORS[colorIndex];

      offlineSubjects.push(
        <OfflineSubject
          key={name + offlineSubjects.length}
          classNumber={classNumber}
          name={name}
          top={top}
          height={height}
          backgroundColor={color}
          isTempSubject={colorIndex === TEMP_COLOR_INDEX}
          handleDeleteTimetable={handleDeleteTimetable}
        />,
      );
    }

    return <Cell key={day + hour}>{[...offlineSubjects]}</Cell>;
  }

  return <Cell key={day + hour} />;
}

function findSubjectByTime(day: string, hour: number, subjects: ITimetable[]) {
  const foundSubjects: {
    classNumber: string;
    name: string;
    colorIndex: number;
    schedule: ISchedule;
  }[] = [];
  for (const { classNumber, name, colorIndex, schedules } of subjects) {
    if (schedules !== null && colorIndex !== undefined) {
      for (const schedule of schedules) {
        if (day === schedule.day && hour === schedule.startHour) {
          foundSubjects.push({ classNumber, name, colorIndex, schedule });
        }
      }
    }
  }

  return foundSubjects;
}

function calcSubjectPosition(startMinute: number, workingMinutes: number) {
  const MAX_MINUTE = 60;
  const top = (startMinute / MAX_MINUTE) * CELL_HEIGHT;
  const height = (workingMinutes / MAX_MINUTE) * CELL_HEIGHT;
  return { top, height };
}

const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 20px repeat(5, 1fr);
  grid-template-rows: 25px repeat(15, ${`${CELL_HEIGHT}px`});
  overflow: hidden;

  border-top: 1px solid #d6d6d6;
  border-left: 1px solid #d6d6d6;
  > div {
    border-right: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
  }

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
const ColumnHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a6a6a6;
`;
const RowHeader = styled.div`
  text-align: right;
  color: #a6a6a6;
`;
const Cell = styled.div`
  position: relative;
`;

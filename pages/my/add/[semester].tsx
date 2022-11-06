import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import type { ISchedule, ITimetable } from '@/types/timetable';
import Selector from '@/components/timetable/selector';
import {
  CELL_HEIGHT,
  COLORS,
  HOURS,
  MAXIMUM_GRADES,
  TEMP_COLOR_INDEX,
} from '@/consts/timetable';
import Viewer from '@/components/timetable/viewer';
import Button from '@mui/material/Button';
import { CommonAlert, useAlert } from '@/components/CommonAlert';

interface IAdd {
  timetables: ITimetable[];
}

const initializedIndex = -1;

export default function Add({ timetables }: IAdd) {
  const [selectedIndex, setSelectedIndex] = useState(initializedIndex);
  const [addedSubjects, setAddedSubjects] = useState<ITimetable[]>([]);

  const handleSelectSubject = (
    index: number,
    filteredTimetables: ITimetable[],
  ) => {
    if (!filteredTimetables) return;

    if (selectedIndex === index) {
      clearSelectedSubject();
      return;
    }

    setSelectedIndex(index);

    const selectedSubject = { ...filteredTimetables[index] };
    addTempSubject(selectedSubject, addedSubjects, setAddedSubjects);

    scrollSelectedSubject(selectedSubject, viewerScrollRef);

    closeAlert();
  };

  const { alertState, openAlert, closeAlert } = useAlert();

  const handleAddSubject = () => {
    const checkResult = check(addedSubjects);
    if (checkResult) {
      const message = checkResult;
      openAlert(true, message);
      return;
    }

    setAddedSubjectColorIndex(addedSubjects);

    setSelectedIndex(initializedIndex);
  };

  const handleDeleteSubject = (targetClassNumber: string) => {
    setSelectedIndex(initializedIndex);
    const subjects = removeTempSubject(addedSubjects);

    const deleted = subjects.filter(
      ({ classNumber }) => classNumber !== targetClassNumber,
    );
    setAddedSubjects([...deleted]);
  };

  const handleSaveAddedSubjects = () => {
    const subjects = addedSubjects.filter(
      ({ colorIndex }) => colorIndex !== TEMP_COLOR_INDEX,
    );

    console.log(subjects);

    clearSelectedSubject();
  };

  const clearSelectedSubject = useCallback(() => {
    setSelectedIndex(initializedIndex);
    setAddedSubjects((prev) => [...removeTempSubject(prev)]);

    closeAlert();
  }, []);

  const viewerScrollRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper>
      <Main>
        <Selector
          timetables={timetables}
          selectedIndex={selectedIndex}
          handleSelectSubject={handleSelectSubject}
          handleAddSubject={handleAddSubject}
          clearSelectedSubject={clearSelectedSubject}
        />
        <ViewerScrollBox ref={viewerScrollRef}>
          <Viewer
            subjects={addedSubjects}
            handleDeleteSubject={handleDeleteSubject}
          />
        </ViewerScrollBox>
        <ButtonWrapper>
          <StyledButton variant='outlined' color='error'>
            취소
          </StyledButton>
          <StyledButton variant='outlined' onClick={handleSaveAddedSubjects}>
            저장
          </StyledButton>
        </ButtonWrapper>
      </Main>
      <CommonAlert
        isOpen={alertState.isOpen}
        isError={alertState.isError}
        message={alertState.message}
        handleClose={closeAlert}
      />
    </Wrapper>
  );
}

function addTempSubject(
  selectedSubject: ITimetable,
  addedSubjects: ITimetable[],
  setAddedSubjects: Dispatch<SetStateAction<ITimetable[]>>,
) {
  selectedSubject.colorIndex = TEMP_COLOR_INDEX;

  const copiedArr = removeTempSubject(addedSubjects);
  setAddedSubjects([...copiedArr, selectedSubject]);
}

function removeTempSubject(addedSubjects: ITimetable[]) {
  const copiedArr = [...addedSubjects];
  if (copiedArr[copiedArr.length - 1]?.colorIndex === TEMP_COLOR_INDEX) {
    copiedArr.pop();
  }

  return copiedArr;
}

function scrollSelectedSubject(
  selectedSubject: ITimetable,
  viewerScrollRef: RefObject<HTMLDivElement>,
) {
  const { isELerning, schedules } = selectedSubject;
  if (!isELerning && schedules) {
    let minStartHour = 24;
    for (const schedule of schedules) {
      const { startHour } = schedule;
      if (startHour < minStartHour) {
        minStartHour = startHour;
      }
    }
    const firstHour = HOURS[0];
    const scrollY = (minStartHour - firstHour) * CELL_HEIGHT;

    viewerScrollRef?.current?.scrollTo({
      left: 0,
      top: scrollY,
      behavior: 'smooth',
    });
  } else if (isELerning) {
    viewerScrollRef?.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }
}

function check(addedSubjects: ITimetable[]) {
  const length = addedSubjects.length;
  if (length < 2) return false;

  if (checkMaximumGrades(addedSubjects)) {
    return `최대 ${MAXIMUM_GRADES} 학점까지 추가할 수 있습니다.`;
  }
  if (checkOverlapName(addedSubjects)) {
    return '동일한 수업이 이미 등록되어 있습니다.';
  }
  if (checkOverlapSchedule(addedSubjects)) {
    return '해당 시간에 이미 등록된 수업이 있습니다.';
  }

  return false;
}

function checkMaximumGrades(addedSubjects: ITimetable[]) {
  const totalGrades = addedSubjects.reduce((prev, { grades }) => {
    return prev + grades;
  }, 0);

  return MAXIMUM_GRADES <= totalGrades;
}

function checkOverlapName(addedSubjects: ITimetable[]) {
  const length = addedSubjects.length;
  const selectedSubject = addedSubjects[length - 1];

  for (const subject of addedSubjects) {
    if (subject === selectedSubject) break;

    if (subject.name === selectedSubject.name) {
      return true;
    }
  }

  return false;
}

function checkOverlapSchedule(addedSubjects: ITimetable[]) {
  const length = addedSubjects.length;
  const selectedSubject = addedSubjects[length - 1];
  const selectedSchedules = selectedSubject.schedules;
  if (selectedSubject.isELerning || selectedSchedules === null) return false;

  const addedSchedules: ISchedule[] = [];
  for (const subject of addedSubjects) {
    if (subject === selectedSubject) break;

    if (subject.schedules) {
      addedSchedules.push(...subject.schedules);
    }
  }

  for (const selectedSchedule of selectedSchedules) {
    for (const addedSchedule of addedSchedules) {
      if (selectedSchedule.day === addedSchedule.day) {
        const ss = selectedSchedule;
        const as = addedSchedule;

        const selectedStartMinutes = ss.startHour * 60 + ss.startMinute;
        const selectedEndMinutes = selectedStartMinutes + ss.workingMinutes;
        const addedStartMinutes = as.startHour * 60 + as.startMinute;
        const addedEndMinutes = addedStartMinutes + as.workingMinutes;

        if (selectedStartMinutes <= addedStartMinutes) {
          if (addedStartMinutes <= selectedEndMinutes) {
            return true;
          }
        }
        if (selectedStartMinutes <= addedEndMinutes) {
          if (addedStartMinutes <= selectedEndMinutes) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function setAddedSubjectColorIndex(addedSubjects: ITimetable[]) {
  const lastIndex = addedSubjects.length - 1;
  const MAX_COLOR_INDEX = COLORS.length - 1;
  const rand0to9 = Math.floor(Math.random() * 10);
  const colorIndex = lastIndex <= MAX_COLOR_INDEX ? lastIndex : rand0to9;

  const lastAddedSubject = addedSubjects[lastIndex];
  lastAddedSubject.colorIndex = colorIndex;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { color } }) => color.background};
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Main = styled.main`
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.mobile}) {
    width: 380px;
  }

  display: flex;
  flex-direction: column;
`;

const ViewerScrollBox = styled.div`
  overflow: scroll;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

import { GetStaticProps } from 'next';
import { read } from '@/utils/json';

export async function getStaticPaths() {
  const semesters = await read<string[]>('semesters');
  const paths = semesters.map((semester) => ({ params: { semester } }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const semester = params?.semester as string;
  const timetables = await read<ITimetable[]>(semester);

  return {
    props: { timetables },
  };
};
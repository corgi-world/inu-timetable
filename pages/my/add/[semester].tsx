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
import { CommonDialog, useDialog } from '@/components/CommonDialog';
import SaveDialog from '@/components/timetable/selector/SaveDialog';
import { useSession } from 'next-auth/react';
import { useMajorMap, useUserPostTimetable } from '@/queries/timetable/query';
import { useRouter } from 'next/router';

interface IAdd {
  semester: string;
  timetables: ITimetable[];
}

const initializedIndex = -1;

export default function Add({ semester, timetables }: IAdd) {
  const [selectedIndex, setSelectedIndex] = useState(initializedIndex);
  const [addedTimetables, setAddedTimetables] = useState<ITimetable[]>([]);

  const { alertState, openAlert, closeAlert } = useAlert();
  const { dialogState, openDialog, closeDialog } = useDialog();

  const { data: session } = useSession();

  const { data: majorMap } = useMajorMap();
  const postUserTimetable = useUserPostTimetable();

  const router = useRouter();

  const [saveLoading, setSaveLoading] = useState(false);

  const handleSelectTimetable = (
    index: number,
    filteredTimetables: ITimetable[],
  ) => {
    if (!filteredTimetables) return;

    if (selectedIndex === index) {
      clearSelectedTimetable();
      return;
    }

    setSelectedIndex(index);

    const selectedTimetable = { ...filteredTimetables[index] };
    addTempTimetable(selectedTimetable, addedTimetables, setAddedTimetables);

    scrollSelectedTimetable(selectedTimetable, viewerScrollRef);

    closeAlert();
  };

  const handleAddTimetable = () => {
    const checkResult = check(addedTimetables);
    if (checkResult) {
      const message = checkResult;
      openAlert(true, message);
      return;
    }

    setAddedTimetableColorIndex(addedTimetables);

    setSelectedIndex(initializedIndex);
  };

  const handleDeleteTimetable = (targetClassNumber: string) => {
    setSelectedIndex(initializedIndex);
    const Timetables = removeTempTimetable(addedTimetables);

    const deleted = Timetables.filter(
      ({ classNumber }) => classNumber !== targetClassNumber,
    );
    setAddedTimetables([...deleted]);
  };

  const handleSaveClick = () => {
    const Timetables = addedTimetables.filter(
      ({ colorIndex }) => colorIndex !== TEMP_COLOR_INDEX,
    );

    clearSelectedTimetable();

    if (Timetables.length === 0) {
      openAlert(true, '시간표를 추가해주세요.');
      return;
    }
    if (!majorMap) {
      openAlert(true, '데이터를 불러오는데 실패했습니다.');
      return;
    }

    openDialog();
  };

  const handleSaveAddedTimetables = async (
    college: string,
    major: string,
    grade: string,
  ) => {
    if (!session?.user) {
      openAlert(true, '데이터를 불러오는데 실패했습니다.');
      return;
    }
    const { email: id, name: nickname } = session.user;

    closeDialog();

    const { ok, message } = await saveTimetables(
      id as string,
      nickname as string,
      college,
      major,
      grade,
    );

    if (ok) {
      goMypage();
    } else if (!ok) {
      openAlert(true, message);
    }
  };

  const saveTimetables = async (
    id: string,
    nickname: string,
    college: string,
    major: string,
    grade: string,
  ) => {
    setSaveLoading(true);

    const totalGrades = calcTotalGrades(addedTimetables);
    const { data } = await postUserTimetable({
      id,
      nickname,
      semester,
      college,
      major,
      grade,
      totalGrades,
      timetables: addedTimetables,
    });

    setSaveLoading(false);

    return data;
  };

  const goMypage = () => {
    router.push('/my');
  };

  const clearSelectedTimetable = useCallback(() => {
    setSelectedIndex(initializedIndex);
    setAddedTimetables((prev) => [...removeTempTimetable(prev)]);

    closeAlert();
  }, []);

  const viewerScrollRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper>
      <Main>
        <Selector
          timetables={timetables}
          selectedIndex={selectedIndex}
          handleSelectTimetable={handleSelectTimetable}
          handleAddTimetable={handleAddTimetable}
          clearSelectedTimetable={clearSelectedTimetable}
        />
        <ViewerScrollBox ref={viewerScrollRef}>
          <Viewer
            timetables={addedTimetables}
            handleDeleteTimetable={handleDeleteTimetable}
          />
        </ViewerScrollBox>
        <ButtonWrapper>
          {saveLoading ? (
            <Loading>저장중...</Loading>
          ) : (
            <>
              <StyledButton variant='outlined' color='error' onClick={goMypage}>
                취소
              </StyledButton>
              <StyledButton variant='outlined' onClick={handleSaveClick}>
                저장
              </StyledButton>
            </>
          )}
        </ButtonWrapper>
      </Main>
      <CommonAlert
        isOpen={alertState.isOpen}
        isError={alertState.isError}
        message={alertState.message}
        handleClose={closeAlert}
      />
      {majorMap ? (
        <CommonDialog isOpen={dialogState.isOpen} handleClose={closeDialog}>
          <SaveDialog
            majorMap={majorMap}
            handleClose={closeDialog}
            handleSave={handleSaveAddedTimetables}
          />
        </CommonDialog>
      ) : null}
    </Wrapper>
  );
}

function addTempTimetable(
  selectedTimetable: ITimetable,
  addedTimetables: ITimetable[],
  setAddedTimetables: Dispatch<SetStateAction<ITimetable[]>>,
) {
  selectedTimetable.colorIndex = TEMP_COLOR_INDEX;

  const copiedArr = removeTempTimetable(addedTimetables);
  setAddedTimetables([...copiedArr, selectedTimetable]);
}

function removeTempTimetable(addedTimetables: ITimetable[]) {
  const copiedArr = [...addedTimetables];
  if (copiedArr[copiedArr.length - 1]?.colorIndex === TEMP_COLOR_INDEX) {
    copiedArr.pop();
  }

  return copiedArr;
}

function scrollSelectedTimetable(
  selectedTimetable: ITimetable,
  viewerScrollRef: RefObject<HTMLDivElement>,
) {
  const { isELerning, schedules } = selectedTimetable;
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

function check(addedTimetables: ITimetable[]) {
  const length = addedTimetables.length;
  if (length < 2) return false;

  if (checkMaximumGrades(addedTimetables)) {
    return `최대 ${MAXIMUM_GRADES} 학점까지 추가할 수 있습니다.`;
  }
  if (checkOverlapName(addedTimetables)) {
    return '동일한 수업이 이미 등록되어 있습니다.';
  }
  if (checkOverlapSchedule(addedTimetables)) {
    return '해당 시간에 이미 등록된 수업이 있습니다.';
  }

  return false;
}

function checkMaximumGrades(addedTimetables: ITimetable[]) {
  const totalGrades = calcTotalGrades(addedTimetables);

  return MAXIMUM_GRADES < totalGrades;
}

function calcTotalGrades(addedTimetables: ITimetable[]) {
  const totalGrades = addedTimetables.reduce((prev, { grades }) => {
    return prev + grades;
  }, 0);

  return totalGrades;
}

function checkOverlapName(addedTimetables: ITimetable[]) {
  const length = addedTimetables.length;
  const selectedTimetable = addedTimetables[length - 1];

  for (const Timetable of addedTimetables) {
    if (Timetable === selectedTimetable) break;

    if (Timetable.name === selectedTimetable.name) {
      return true;
    }
  }

  return false;
}

function checkOverlapSchedule(addedTimetables: ITimetable[]) {
  const length = addedTimetables.length;
  const selectedTimetable = addedTimetables[length - 1];
  const selectedSchedules = selectedTimetable.schedules;
  if (selectedTimetable.isELerning || selectedSchedules === null) return false;

  const addedSchedules: ISchedule[] = [];
  for (const Timetable of addedTimetables) {
    if (Timetable === selectedTimetable) break;

    if (Timetable.schedules) {
      addedSchedules.push(...Timetable.schedules);
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

function setAddedTimetableColorIndex(addedTimetables: ITimetable[]) {
  const lastIndex = addedTimetables.length - 1;
  const MAX_COLOR_INDEX = COLORS.length - 1;
  const rand0to9 = Math.floor(Math.random() * 10);
  const colorIndex = lastIndex <= MAX_COLOR_INDEX ? lastIndex : rand0to9;

  const lastAddedTimetable = addedTimetables[lastIndex];
  lastAddedTimetable.colorIndex = colorIndex;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 10px;
  display: flex;
  justify-content: center;
`;

const Main = styled.main`
  width: 100%;
  @media (min-width: ${({ theme: { size } }) => size.desktop}) {
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

const Loading = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

import { GetStaticProps } from 'next';
import { read } from '@/utils/json';

export function getStaticPaths() {
  const semesters = read<string[]>('semesters');
  const paths = semesters.map((semester) => ({ params: { semester } }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = ({ params }) => {
  const semester = params?.semester as string;
  const timetables = read<ITimetable[]>(semester);

  return {
    props: { semester, timetables },
  };
};

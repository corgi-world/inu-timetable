import React from 'react';
import Subject from './Subject';
import type { ISchedule, ITimetable } from '@/types/timetable';

interface ISubjectList {
  filteredTimetables: ITimetable[];
  selectedIndex: number;
  handleSelectSubject: (index: number) => void;
  handleAddSubject: () => void;
}

export default function SubjectList({
  filteredTimetables,
  selectedIndex,
  handleSelectSubject,
  handleAddSubject,
}: ISubjectList) {
  return (
    <>
      {filteredTimetables.map(
        ({ classNumber, name, professor, schedules }, index) => (
          <Subject
            key={classNumber}
            name={name}
            professor={professor}
            schedules={parseTimeString(schedules)}
            index={index}
            isSelected={selectedIndex === index}
            handleSelectSubject={handleSelectSubject}
            handleAddSubject={handleAddSubject}
          />
        ),
      )}
    </>
  );
}

function parseTimeString(schedules: ISchedule[] | null) {
  if (!schedules) return '';

  const length = schedules.length;
  if (2 < length || length === 0) {
    return '';
  }

  const strings = [];
  for (const { day, startHour, startMinute, workingMinutes } of schedules) {
    const date = new Date();
    date.setHours(startHour);
    date.setMinutes(startMinute);
    const startTime = formatTimeString(date);
    date.setMinutes(date.getMinutes() + workingMinutes);
    const endTime = formatTimeString(date);
    const str = `${day} ${startTime}~${endTime}`;
    strings.push(str);
  }

  return strings.join(', ');
}

function formatTimeString(date: Date) {
  const hh = date.getHours();
  const minutes = date.getMinutes();
  const mm = minutes < 10 ? `0${minutes}` : minutes;
  return `${hh}:${mm}`;
}

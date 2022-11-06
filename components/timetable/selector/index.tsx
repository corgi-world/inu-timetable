import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { ITimetable } from '@/types/timetable';
import Select from '@/components/MuiSelect';
import TextField from '@/components/MuiTextField';
import SubjectList from './SubjectList';

interface ISelector {
  timetables: ITimetable[];
  selectedIndex: number;
  handleSelectSubject: (
    index: number,
    filteredTimetables: ITimetable[],
  ) => void;
  handleAddSubject: () => void;
  clearSelectedSubject: () => void;
}

export default function Selector({
  timetables,
  selectedIndex,
  handleSelectSubject,
  handleAddSubject,
  clearSelectedSubject,
}: ISelector) {
  const {
    categories,
    category,
    setCategory,
    keyword,
    setKeyword,
    filteredTimetables,
  } = useTimetables(timetables);

  const SubjectListScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearSelectedSubject();

    clearSubjectListScroll(SubjectListScrollRef);
  }, [clearSelectedSubject, category, keyword]);

  return (
    <Wrapper>
      <FilterWrapper>
        <Select items={categories} value={category} onChange={setCategory} />
        <TextField
          placeholder='과목 | 교수 검색'
          value={keyword}
          fontSize={16}
          onChange={setKeyword}
        />
      </FilterWrapper>
      <ListWrapper ref={SubjectListScrollRef}>
        <SubjectList
          filteredTimetables={filteredTimetables}
          selectedIndex={selectedIndex}
          handleSelectSubject={(index) => {
            handleSelectSubject(index, filteredTimetables);
          }}
          handleAddSubject={handleAddSubject}
        />
      </ListWrapper>
    </Wrapper>
  );
}

function useTimetables(timetables: ITimetable[]) {
  const categories = Array.from(
    new Set(timetables.map(({ category }) => category)),
  );
  const [category, setCategory] = useState(categories[0]);
  const [keyword, setKeyword] = useState('');

  const filteredTimetables = keyword
    ? filterByKeyword(keyword, timetables)
    : timetables.filter(({ category: c }) => c === category);

  return {
    categories,
    category,
    setCategory,
    keyword,
    setKeyword,
    filteredTimetables,
  };
}

function filterByKeyword(keyword: string, timetables: ITimetable[]) {
  const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
  if (regex.test(keyword)) {
    const filteredByKeyword = timetables.filter(
      (timetable) =>
        timetable.name.includes(keyword) ||
        timetable.professor?.includes(keyword),
    );
    return filteredByKeyword;
  }

  return [];
}

function clearSubjectListScroll(ref: RefObject<HTMLDivElement>) {
  ref?.current?.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  });
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FilterWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
`;

const ListWrapper = styled.div`
  height: 300px;
  overflow: scroll;
  border-left: 1px solid #d6d6d6;
  border-right: 1px solid #d6d6d6;
`;

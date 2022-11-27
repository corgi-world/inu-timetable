[![Integration](https://github.com/corgi-world/inu-timetable/actions/workflows/Integration.yml/badge.svg)](https://github.com/corgi-world/inu-timetable/actions/workflows/Integration.yml)

# 인천대학교 시간표 통계 서비스

## 개요

수강신청 시즌마다 대학 커뮤니티인 에브리타임에는 시간표 관련 질문 게시글이 많이 올라온다. 몇 학점을 듣는 것이 적당한지, 어떤 전공 선택 과목을 듣는 것이 취업에 유리한지, 다른 동기들은 시간표를 어떻게 짰는지 등 혼자 고민해서는 풀 수 없는 문제들이 대부분이다. 이러한 문제를 해결하기 위해 가입된 유저들이 본인의 시간표를 등록하면 이를 전공과 학년에 따라 집계 및 가공하여 수강신청을 앞둔 학우들에게 유의미한 정보를 전달할 수 있는 서비스를 기획 및 개발 중이다.

## 동작

https://user-images.githubusercontent.com/83255812/201507607-83908490-f870-48c2-8e48-ddc0afe9ffed.mp4

## 기술 스택

- Next.js, Typescript, React Query, Prisma, PlanetScale, NextAuth

## 기능

### 피드 페이지

![1](https://user-images.githubusercontent.com/83255812/201507706-9b4c4a2f-fc6f-4848-9893-6d3e854082f8.png)

- 다른 유저들이 등록한 시간표를 확인할 수 있다.
- 단과대학, 전공, 학년에 따른 필터링이 가능하다.
- 무한 스크롤을 구현하였다.
  - https://velog.io/@corgi-world/Next.js-React-Query-Prisma와-함께하는-무한-스크롤
- prisma query

  ```ts
  const isCallNextPage = (index as string) !== '0';
  const pageCondition = {
    skip: 1,
    cursor: {
      index: +index,
    },
  };

  const result = await client.timetables.findMany({
    where: {
      AND: {
        semester: {
          equals: semester as string,
        },
        college: isAll(college)
          ? undefined
          : {
              equals: college as string,
            },
        major: isAll(major)
          ? undefined
          : {
              equals: major as string,
            },
        grade: isAll(grade)
          ? undefined
          : {
              equals: grade as string,
            },
      },
    },
    orderBy: {
      index: 'desc',
    },
    take: TAKE_COUNT,
    ...(isCallNextPage && pageCondition),
  });
  ```

- react query

  ```ts
  export function useFeedTimetables(
    semester: string,
    college: string,
    major: string,
    grade: string,
  ) {
    const queryString = `?semester=${semester}&college=${college}&major=${major}&grade=${grade}`;

    const queryResult = useInfiniteQuery<IUserTimetablesResponse>(
      ['feed', semester, college, major, grade],
      ({ pageParam = 0 }) =>
        get(feedGetService, `${queryString}&index=${pageParam}`),
      {
        getNextPageParam: ({ userTimetables }) =>
          userTimetables
            ? userTimetables[userTimetables.length - 1].index
            : undefined,
        refetchOnWindowFocus: false,
      },
    );

    return queryResult;
  }
  ```

### 통계 페이지

![2](https://user-images.githubusercontent.com/83255812/201507963-a1b1e45e-5a38-474b-9f11-2c632be34d73.png)

- 가장 많은 인원이 담은 과목과 총 학점을 확인할 수 있다.
- 단과대학, 전공, 학년에 따른 필터링이 가능하다.
- 데이터가 많아질수록 통계를 위한 연산에 많은 시간이 소요될 수 있으므로 검색 버튼을 누를 때만 쿼리하도록 구현하였다.
- useMemo와 React.memo를 사용하여 불필요한 연산을 방지하였다.

  ```ts
  export default function ContentsManager({
    userTimetables,
  }: IContentsManager) {
    const { subjectNames, subjectCountMap } = useMemo<ITableData>(
      () => calculateTableData(userTimetables),
      [],
    );

    const { categories, data } = useMemo<IChartProps>(
      () => calculateChartProps(userTimetables),
      [],
    );

    const renderContents = () => {
      const length = subjectNames.length;
      if (0 < length) {
        return (
          <>
            <SubjectCountTable
              subjectNames={subjectNames}
              subjectCountMap={subjectCountMap}
            />
            <ChartWrapper>
              <TotalGradesChart categories={categories} data={data} />
            </ChartWrapper>
          </>
        );
      } else {
        return <>저장된 데이터가 없습니다.</>;
      }
    };

    return <Wrapper>{renderContents()}</Wrapper>;
  }
  ```

### 시간표 추가 페이지

![3](https://user-images.githubusercontent.com/83255812/201508297-81f6c640-f4f6-4801-90a3-c85b68e78ca9.png)

- 본인이 원하는 과목을 선택하여 시간표를 추가할 수 있다.
- 사용자 경험을 고려하여 과목 선택 시 선택한 과목으로 스크롤되는 기능 구현하였다.
- 과목끼리의 시간표 중복, 동일한 과목, 최대 24학점 등 잘못된 시간표를 추가할 수 없도록 모든 경우의 수를 고려하였다.
- 엑셀 파일로 학교 홈페이지에 업로드 된 학교 시간표를 json 파일로 변경하여 사용하였다.
  - 엑셀 파일을 json 파일로 변경하는 코드 ↓
  - https://github.com/corgi-world/inu-timetable-excel-to-json
- 시간표 추가 페이지에 접근할 때마다 과목 목록을 불러오는 것은 사용자 경험 측면에서 좋지 못하다고 판단하였다.

- getStaticPaths와 getStaticProps를 사용하여 빌드 타임 때 학기별 페이지를 생성하였다. (/add/2022-01, /add/2022-02)

  ```ts
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
  ```

### 로그인, 회원가입

![8](https://user-images.githubusercontent.com/83255812/201508918-89d7c4d5-2ff4-41cf-80da-c9c44dd357aa.png)

- 최소한의 정규식 사용으로 잘못된 문자를 입력하는 것을 방지하였다.
- 회원가입 시 아이디와 닉네임의 중복을 검사하였다.
- 로그인 실패 사유를 메세지를 통해 전달하였다.
- NextAuth를 사용하여 인증을 구현하였다.

### 데이터베이스 관리

![9](https://user-images.githubusercontent.com/83255812/201509095-266f33a8-454b-428f-ab53-900230554d4a.png)

- Prisma와 PlanetScale을 사용하여 유저 정보와 유저의 시간표를 관리하였다.

### Github Actions를 사용한 지속적 통합 구축

- CI/CD 학습을 목표로 최소한의 테스트 코드 작성 후 main branch에 push, merge, pull request시 테스트와 lint 검사를 자동으로 수행하도록 yml파일을 작성하였다.

  ```yml
  name: Integration

  on:
    push:
    pull_request:
      branches: [main, dev-main]

  jobs:
    lint:
      name: Lint
      runs-on: ubuntu-latest
      steps:
        - name: Clone Repo
          uses: actions/checkout@v3
        - name: Install dependencies
          run: |
            echo "Running Installing Dependencies..."
            npm install
        - name: Run Linting
          run: |
            echo "Running Linting"
            npm run lint
          env:
            CI: true

    test:
      name: Test
      runs-on: ubuntu-latest
      steps:
        - name: Clone Repo
          uses: actions/checkout@v3
        - name: Install dependencies
          run: |
            echo "Running Installing Dependencies..."
            npm install
        - name: Run Test
          run: |
            echo "Running Test"
            npm run test:ci
  ```

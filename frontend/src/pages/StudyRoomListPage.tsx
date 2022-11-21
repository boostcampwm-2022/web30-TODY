import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import SearchBar from '@components/common/SearchBar';
import ViewConditionCheckBox from '@components/common/ViewConditionCheckBox';
import CreateButton from '@components/common/CreatButton';
import StudyRoomItem from '@components/studyRoomList/StudyRoomItem';
import Pagination from '@components/common/Pagination';

const StudyRoomListPageLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  padding: 45px 30px;
`;

const PageTitle = styled.h1`
  margin-bottom: 24px;
  font-family: 'yg-jalnan';
  font-size: 25px;
  font-weight: 700;
`;

const SearchInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SearchResultText = styled.h3`
  font-weight: 700;
  font-size: 20px;
`;

const RoomListLayout = styled.div`
  min-height: 485px;
  margin: 30px 0 35px;
`;

const StudyRoomList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export default function StudyRoomListPage() {
  const searchResult = {
    keyword: '한국사',
    currentPage: 1,
    pageCount: 5,
    totalCount: 45,
    studyRoomList: [
      {
        studyRoomId: 1,
        name: '한국사 1급 자격증 공부',
        content: '같이 공부해요',
        maxPersonnel: 8,
        currentPersonnel: 3,
        managerNickname: '숨숨',
        tags: ['수학', '음소거'],
        nicknamesOfParticipants: ['peter', '신신', '숨숨'],
        created: '2022-11-03 22:00:01',
      },
      {
        studyRoomId: 2,
        name: '국어방',
        content: '수능 대비 문제풀이',
        maxPersonnel: 5,
        currentPersonnel: 2,
        managerNickname: '신신',
        tags: ['국어'],
        nicknamesOfParticipants: ['peter', '신신'],
        created: '2022-11-04 11:00:00',
      },
      {
        studyRoomId: 1,
        name: '한국사 1급 자격증 공부',
        content: '같이 공부해요',
        maxPersonnel: 8,
        currentPersonnel: 3,
        managerNickname: '숨숨',
        tags: ['수학', '음소거'],
        nicknamesOfParticipants: ['peter', '신신', '숨숨'],
        created: '2022-11-03 22:00:01',
      },
      {
        studyRoomId: 2,
        name: '국어방',
        content: '수능 대비 문제풀이',
        maxPersonnel: 5,
        currentPersonnel: 2,
        managerNickname: '신신',
        tags: ['국어'],
        nicknamesOfParticipants: ['peter', '신신'],
        created: '2022-11-04 11:00:00',
      },
      {
        studyRoomId: 1,
        name: '한국사 1급 자격증 공부',
        content: '같이 공부해요',
        maxPersonnel: 8,
        currentPersonnel: 3,
        managerNickname: '숨숨',
        tags: ['수학', '음소거'],
        nicknamesOfParticipants: ['peter', '신신', '숨숨'],
        created: '2022-11-03 22:00:01',
      },
      {
        studyRoomId: 2,
        name: '국어방',
        content: '수능 대비 문제풀이',
        maxPersonnel: 5,
        currentPersonnel: 2,
        managerNickname: '신신',
        tags: ['국어'],
        nicknamesOfParticipants: ['peter', '신신'],
        created: '2022-11-04 11:00:00',
      },
      {
        studyRoomId: 1,
        name: '한국사 1급 자격증 공부',
        content: '같이 공부해요',
        maxPersonnel: 8,
        currentPersonnel: 3,
        managerNickname: '숨숨',
        tags: ['수학', '음소거'],
        nicknamesOfParticipants: ['peter', '신신', '숨숨'],
        created: '2022-11-03 22:00:01',
      },
      {
        studyRoomId: 2,
        name: '국어방',
        content: '수능 대비 문제풀이',
        maxPersonnel: 5,
        currentPersonnel: 2,
        managerNickname: '신신',
        tags: ['국어'],
        nicknamesOfParticipants: ['peter', '신신'],
        created: '2022-11-04 11:00:00',
      },
    ],
  };

  return (
    <StudyRoomListPageLayout>
      <MainSideBar />
      <Content>
        <PageTitle>공부방 목록</PageTitle>
        <CreateButton>공부방 생성</CreateButton>
        <SearchBar guideText="👉 방 이름, 방 설명, 방 태그로 공부방을 검색해보세요" />

        <SearchInfoLayout>
          <SearchResultText>
            {searchResult.keyword}에 대한 검색결과 총 {searchResult.totalCount}
            건
          </SearchResultText>
          <div className="flex-row">
            <ViewConditionCheckBox>참여 가능한 방만 보기</ViewConditionCheckBox>
            <ViewConditionCheckBox>비밀 방만 보기</ViewConditionCheckBox>
          </div>
        </SearchInfoLayout>

        <RoomListLayout>
          <StudyRoomList>
            {searchResult.studyRoomList.map((room) => (
              <StudyRoomItem {...room} />
            ))}
          </StudyRoomList>
        </RoomListLayout>

        <Pagination
          pageCount={searchResult.pageCount}
          currentPage={searchResult.currentPage}
        />
      </Content>
    </StudyRoomListPageLayout>
  );
}

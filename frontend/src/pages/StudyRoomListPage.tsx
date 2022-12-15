import { useEffect, useState } from 'react';
import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import SearchBar from '@components/common/SearchBar';
import ViewConditionCheckBox from '@components/common/ViewConditionCheckBox';
import CreateButton from '@components/common/CreatButton';
import Loader from '@components/common/Loader';
import { RoomListData } from 'types/studyRoomList.types';
import StudyRoomList from '@components/studyRoomList/StudyRoomList';
import Pagination from '@components/common/Pagination';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
import useAxios from '@hooks/useAxios';
import GlobalChat from '@components/studyRoomList/GlobalChat';
import CreateNewRoomModal from '@components/studyRoomList/CreateNewRoomModal';
import getStudyRoomListRequest from '../axios/requests/getStudyRoomListRequest';

const StudyRoomListPageLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 45px 30px 0;
  height: 100vh;
  overflow: auto;
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
  align-items: center;
`;

const SearchResultText = styled.h3`
  font-weight: 700;
  font-size: 20px;
`;

export default function StudyRoomListPage() {
  const location = useLocation();
  const queryString = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const [getRoomListRequest, getRoomListLoading, , searchResult] =
    useAxios<RoomListData>(getStudyRoomListRequest);

  const [page, setPage] = useState((Number(queryString.page) as number) || 1);
  const [keyword, setKeyword] = useState((queryString.keyword as string) || '');
  const [attendable, setAttendable] = useState(
    Boolean(queryString.attendable) || false,
  );

  useEffect(() => {
    getRoomListRequest({
      page,
      keyword,
      attendable,
    });
  }, [page, keyword, attendable]);

  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  return (
    <StudyRoomListPageLayout>
      <MainSideBar />
      <Content>
        {getRoomListLoading && <Loader />}
        <PageTitle>공부방 목록</PageTitle>
        <CreateButton onClick={openModal}>공부방 생성</CreateButton>
        <SearchBar
          guideText="👉 방 이름, 방 설명, 방 태그로 공부방을 검색해보세요"
          setKeyword={setKeyword}
          setPage={setPage}
          attendable={attendable}
        />

        <SearchInfoLayout>
          <SearchResultText>
            {searchResult?.keyword &&
              `"${searchResult?.keyword}"에 대한 검색결과`}{' '}
            총 {searchResult?.totalCount}건
          </SearchResultText>
          <div className="flex-row">
            <ViewConditionCheckBox setState={setAttendable}>
              참여 가능한 방만 보기
            </ViewConditionCheckBox>
          </div>
        </SearchInfoLayout>
        <StudyRoomList searchResult={searchResult} />
        {searchResult && (
          <Pagination
            pageCount={searchResult.pageCount}
            currentPage={searchResult.currentPage}
            setPage={setPage}
            getRoomConditions={{ keyword, attendable }}
          />
        )}
        <GlobalChat />
      </Content>
      {modal && <CreateNewRoomModal setModal={setModal} />}
    </StudyRoomListPageLayout>
  );
}

import { useState } from 'react';
import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import SearchBar from '@components/common/SearchBar';
import CreateButton from '@components/common/CreatButton';
import GlobalChat from '@components/studyRoomList/GlobalChat';
import CreateNewRoomModal from '@components/studyRoomList/CreateNewRoomModal';
import SearchRoomResult from '@components/studyRoomList/SearchRoomResult';

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

export default function StudyRoomListPage() {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  return (
    <StudyRoomListPageLayout>
      <MainSideBar />
      <Content>
        <PageTitle>공부방 목록</PageTitle>
        <CreateButton onClick={openModal}>공부방 생성</CreateButton>
        <SearchBar guideText="👉 방 이름, 방 설명, 방 태그로 공부방을 검색해보세요" />
        <SearchRoomResult />
        <GlobalChat />
      </Content>
      {modal && <CreateNewRoomModal setModal={setModal} />}
    </StudyRoomListPageLayout>
  );
}

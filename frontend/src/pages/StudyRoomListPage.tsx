import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import SearchBar from '@components/common/SearchBar';
import ViewConditionCheckBox from '@components/common/ViewConditionCheckBox';

const MainPageLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 45px 30px;
`;

export default function StudyRoomListPage() {
  return (
    <MainPageLayout>
      <MainSideBar />
      <Content>
        <SearchBar guideText="👉 방 이름, 방 설명, 방 태그로 공부방을 검색해보세요" />
        <ViewConditionCheckBox>참여 가능한 방만 보기</ViewConditionCheckBox>
        <ViewConditionCheckBox>비밀 방만 보기</ViewConditionCheckBox>
      </Content>
    </MainPageLayout>
  );
}

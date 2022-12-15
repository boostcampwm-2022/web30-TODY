import { useEffect, useState } from 'react';
import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import SearchBar from '@components/common/SearchBar';
import ViewConditionCheckBox from '@components/common/ViewConditionCheckBox';
import CreateButton from '@components/common/CreatButton';
import Modal from '@components/common/Modal';
import CustomInput from '@components/common/CustomInput';
import CustomButton from '@components/common/CustomButton';
import TagInput from '@components/studyRoomList/TagInput';
import Loader from '@components/common/Loader';
import { NewRoomInfoData, RoomListData } from 'types/studyRoomList.types';
import StudyRoomList from '@components/studyRoomList/StudyRoomList';
import Pagination from '@components/common/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import useAxios from '@hooks/useAxios';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import GlobalChat from '@components/studyRoomList/GlobalChat';
import getStudyRoomListRequest from '../axios/requests/getStudyRoomListRequest';
import createStudyRoomRequest from '../axios/requests/createStudyRoomRequest';

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
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const [
    getRoomListRequest,
    getRoomListLoading,
    getRoomListError,
    searchResult,
  ] = useAxios<RoomListData>(getStudyRoomListRequest);

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

  const [createRoomRequest, createRoomLoading, createRoomError, createdRoomId] =
    useAxios<{
      studyRoomId: number;
    }>(createStudyRoomRequest);

  const newRoomInfoInitState = {
    name: '',
    content: '',
    maxPersonnel: 1,
  };

  const [newRoomInfo, setNewRoomInfo] =
    useState<NewRoomInfoData>(newRoomInfoInitState);
  const [tagList, setTagList] = useState<string[]>([]);
  const [modal, setModal] = useState(false);

  const user = useRecoilValue(userState);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.slice(0, 25);
      case 'content':
        return value.slice(0, 100);
      case 'maxPersonnel':
        return Number(value);
      default:
        return value;
    }
  };

  const onChangeNewRoomInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoomInfo({
      ...newRoomInfo,
      [name]: validateInput(name, value),
    });
  };

  const openModal = () => {
    setNewRoomInfo(newRoomInfoInitState);
    setModal(true);
  };

  const createNewStudyRoom = () => {
    if (newRoomInfo.name === '' || newRoomInfo.maxPersonnel < 1) return;

    if (user) {
      createRoomRequest({
        ...newRoomInfo,
        managerId: user.userId,
        tags: tagList,
      });
    }
    setTagList([]);
  };

  useEffect(() => {
    if (createdRoomId) {
      navigate(`/study-room/${createdRoomId}`, {
        state: newRoomInfo,
      });
    }
  }, [createdRoomId]);

  useEffect(() => {
    if (createRoomError) alert(createRoomError);
    if (getRoomListError) alert(getRoomListError);
  }, [createRoomError, getRoomListError]);

  return (
    <StudyRoomListPageLayout>
      <MainSideBar />
      <Content>
        {(createRoomLoading || getRoomListLoading) && <Loader />}
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
      {modal && (
        <Modal setModal={setModal}>
          <PageTitle>새로운 공부방 만들기</PageTitle>
          <CustomInput
            placeholder="방 이름"
            guideText="※ 방 이름은 25자 이내로 작성해주세요."
            name="name"
            value={newRoomInfo.name}
            onChange={onChangeNewRoomInfo}
          />
          <CustomInput
            placeholder="방 설명"
            guideText="※ 방 설명은 100자 이내로 작성해주세요."
            name="content"
            value={newRoomInfo.content}
            onChange={onChangeNewRoomInfo}
          />
          <CustomInput
            placeholder="방 접속 최대 인원 수"
            guideText="※ 인원수는 최소 1명 이상이어야 합니다."
            type="number"
            name="maxPersonnel"
            min={1}
            value={newRoomInfo.maxPersonnel}
            onChange={onChangeNewRoomInfo}
          />
          <TagInput tagList={tagList} setTagList={setTagList} />
          <CustomButton onClick={createNewStudyRoom} margin="20px 0 0">
            공부하러 GO
          </CustomButton>
        </Modal>
      )}
    </StudyRoomListPageLayout>
  );
}

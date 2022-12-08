/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from 'react';
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
import ChatItem from '@components/studyRoomList/StudyRoomListChatItem';
import ChatBar from '@components/studyRoomList/StudyRoomListChatBar';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import useAxios from '@hooks/useAxios';
import { io } from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import { v4 } from 'uuid';
import getStudyRoomListRequest from '../axios/requests/getStudyRoomListRequest';
import createStudyRoomRequest from '../axios/requests/createStudyRoomRequest';

const StudyRoomListPageLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  position: relative;
  padding: 45px 30px;
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
`;

const SearchResultText = styled.h3`
  font-weight: 700;
  font-size: 20px;
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 296px;
  padding: 25px 28px 25px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 2px -2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 30px 30px 0px 0px;
  background-color: var(--orange2);
`;

const ChatList = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
    border-raduis: 2px;
    background: var(--orange3);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: var(--orange);
  }
`;

const socket = io(process.env.REACT_APP_SOCKET_URL!, {
  autoConnect: false,
  path: '/globalChat/socket.io',
});

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

  const [page, setPage] = useState(queryString.page || 1);
  const [keyword, setKeyword] = useState(queryString.keyword || '');
  const [attendable, setAttendable] = useState(queryString.attendable || false);

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
  const [chatContentsList, setChatContentsList] = useState<
    Array<{ name: string; content: string }>
  >([]);

  const chatListRef = useRef<HTMLDivElement>(null);

  const user = useRecoilValue(userState);
  const [chat, setChat] = useState<string>('');

  useEffect(() => {
    if (user && chat) {
      socket.emit('globalChat', { nickname: user.nickname, chat });
      setChatContentsList((prev) => [
        ...prev,
        { name: user.nickname, content: chat },
      ]);
      setChat('');
    }
  }, [chat]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatContentsList]);

  useEffect(() => {
    socket.connect();

    socket.on(
      'globalChat',
      async (body: { nickname: string; chat: string }) => {
        setChatContentsList((prev) => [
          ...prev,
          { name: body.nickname, content: body.chat },
        ]);
      },
    );
    return () => {
      socket.off('connect');
    };
  }, []);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.slice(0, 10);
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
            <ViewConditionCheckBox>참여 가능한 방만 보기</ViewConditionCheckBox>
            {/* <ViewConditionCheckBox>비밀 방만 보기</ViewConditionCheckBox> */}
          </div>
        </SearchInfoLayout>
        <StudyRoomList searchResult={searchResult} />
        <ChatContainer>
          <ChatList ref={chatListRef}>
            {chatContentsList.map(({ name, content }) => {
              return <ChatItem key={v4()} name={name} content={content} />;
            })}
          </ChatList>
          <ChatBar nickname={user?.nickname} setChat={setChat} />
        </ChatContainer>
        {searchResult && (
          <Pagination
            pageCount={searchResult.pageCount}
            currentPage={searchResult.currentPage}
            setPage={setPage}
            getRoomConditions={{ keyword, attendable }}
          />
        )}
      </Content>
      {modal && (
        <Modal setModal={setModal}>
          <PageTitle>새로운 공부방 만들기</PageTitle>
          <CustomInput
            placeholder="방 이름"
            guideText="※ 방 이름은 10자 이내로 작성해주세요."
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

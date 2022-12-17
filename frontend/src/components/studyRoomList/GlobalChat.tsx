/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ChatItem from '@components/studyRoomList/StudyRoomListChatItem';
import ChatBar from '@components/studyRoomList/StudyRoomListChatBar';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import { v4 } from 'uuid';
import { io } from 'socket.io-client';
import { ReactComponent as DownArrow } from '@assets/icons/down-triangle.svg';

const StyledDownArrowIcon = styled(DownArrow)`
  width: 18px;
`;

const ChatLayout = styled.div`
  position: relative;
  margin: 8px -30px 0;
  min-height: 47px;
`;

const ActiveButton = styled.button`
  width: 118px;
  height: 33px;
  margin: 2px 0 -1px 66px;
  border-radius: 10px 10px 0px 0px;
  box-shadow: 2px -2px 2px rgb(0 0 0 / 17%);
  background-color: var(--orange2);
  z-index: 1;
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 296px;
  padding: 25px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 2px -2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 30px 30px 0px 0px;
  background-color: var(--orange2);
  transition: all 1s;
`;

const ChatList = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
    background: var(--orange3);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--orange);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  &.inactive {
    ${StyledDownArrowIcon} {
      transform: rotate(180deg);
    }
    ${ChatContainer} {
      height: 0;
      padding: 11px 28px;
    }
  }
`;

const socket = io(process.env.REACT_APP_SOCKET_URL!, {
  autoConnect: false,
  path: '/globalChat/socket.io',
});

function GlobalChat() {
  const user = useRecoilValue(userState);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [chatList, setChatList] = useState<
    Array<{ name: string; content: string }>
  >([]);
  const [chat, setChat] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleChat = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) return;
    setIsActive(!isActive);
  };

  useEffect(() => {
    socket.connect();

    socket.on(
      'globalChat',
      async (body: { nickname: string; chat: string }) => {
        setChatList((prev) => [
          ...prev,
          { name: body.nickname, content: body.chat },
        ]);
      },
    );

    return () => {
      socket.off('globalChat');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user && chat) {
      socket.emit('globalChat', { nickname: user.nickname, chat });
      setChatList((prev) => [...prev, { name: user.nickname, content: chat }]);
      setChat('');
    }
  }, [chat]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <ChatLayout>
      <Wrapper className={isActive ? 'active' : 'inactive'}>
        <ActiveButton onClick={toggleChat}>
          <StyledDownArrowIcon />
        </ActiveButton>
        <ChatContainer>
          <ChatList ref={chatListRef}>
            {chatList.map(({ name, content }) => {
              return <ChatItem key={v4()} name={name} content={content} />;
            })}
          </ChatList>
          <ChatBar nickname={user?.nickname} setChat={setChat} />
        </ChatContainer>
      </Wrapper>
    </ChatLayout>
  );
}

export default React.memo(GlobalChat);

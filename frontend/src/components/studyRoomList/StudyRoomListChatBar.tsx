import styled from 'styled-components';
import { KeyboardEvent, SetStateAction, Dispatch } from 'react';

const ChatBar = styled.div`
  display: flex;
  gap: 14px;
`;

const ChatModeBar = styled.div`
  width: 176px;
  height: 50px;
  background-color: var(--orange3);
  border-radius: 5px;
  text-align: center;
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 18px;
  line-height: 54px;
`;

const ChatInputBar = styled.input`
  width: calc(100% - 176px);
  height: 50px;
  padding-left: 18px;
  background-color: var(--orange4);
  border: none;
  font-family: 'Pretendard';
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
`;

interface Props {
  nickname: string | undefined;
  setChat: Dispatch<SetStateAction<string>>;
}

export default function StudyRoomListChatBar(props: Props) {
  const { setChat, nickname } = props;
  return (
    <ChatBar>
      <ChatModeBar>모두에게</ChatModeBar>
      <ChatInputBar
        onKeyPress={(e: any) => {
          if (e.key === 'Enter' && nickname && e.target.value !== '') {
            setChat(e.target.value);
            e.target.value = '';
          }
        }}
        placeholder="채팅을 입력하세요."
      />
    </ChatBar>
  );
}

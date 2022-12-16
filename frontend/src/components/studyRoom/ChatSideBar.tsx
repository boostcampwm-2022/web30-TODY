import React from 'react';
import styled from 'styled-components';
import DownArrowIcon from '@assets/icons/down-triangle.svg';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import ChatList from './ChatList';

const StudyRoomSideBarLayout = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-left: 1px solid var(--yellow);

  &.hide {
    display: none;
  }
`;
const ChatTitle = styled.h1`
  margin-top: 20px;
  margin-left: 24px;
  font-family: 'yg-jalnan';
  font-size: 18px;
  font-weight: 700;
`;

const ChatInputLayout = styled.div`
  margin: 10px 15px 0;
  padding: 15px 0;
  border-top: 1px solid #d9d9d9;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: #ffeec3;
  border-radius: 10px;
  border: none;
  font-size: 18px;

  &::placeholder {
    color: #ff7426;
  }
`;

const SelectReceiverLayout = styled.div`
  margin: 0 0 16px 9px;
  display: flex;
  align-items: center;
  gap: 8px;

  .to {
    font-family: 'yg-jalnan';
    font-weight: 700;
    font-size: 18px;
  }
`;

const SelectReceiver = styled.select`
  width: 120px;
  padding: 5px 10px;
  border: 1px solid #ffce70;
  border-radius: 5px;
  font-size: 16px;
  background: url(${DownArrowIcon}) no-repeat 93% 50%/12px auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
`;

interface Props {
  sendDc: RTCDataChannel | null;
  receiveDcs: { [id: string]: RTCDataChannel };
  isShow: boolean;
}

export default function ChatSideBar({ sendDc, receiveDcs, isShow }: Props) {
  const user = useRecoilValue(userState);
  const sendChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !e.currentTarget.value) return;
    if (!sendDc || !user) return;
    const { value } = e.currentTarget;

    const body = JSON.stringify({
      type: 'chat',
      message: value,
      sender: user.nickname,
    });
    sendDc.send(body);
    e.currentTarget.value = '';
  };

  return (
    <StudyRoomSideBarLayout className={isShow ? '' : 'hide'}>
      <ChatTitle>채팅</ChatTitle>
      <ChatList sendDc={sendDc} receiveDcs={receiveDcs} />
      <ChatInputLayout>
        <SelectReceiverLayout>
          <span className="to">To.</span>
          <SelectReceiver id="">
            <option value="all">모두에게</option>
          </SelectReceiver>
        </SelectReceiverLayout>

        <ChatInput
          type="text"
          onKeyUp={sendChat}
          placeholder="메세지를 입력하세요."
        />
      </ChatInputLayout>
    </StudyRoomSideBarLayout>
  );
}

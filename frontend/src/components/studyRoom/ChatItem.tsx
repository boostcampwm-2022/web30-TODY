import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import styled from 'styled-components';
import { Chat } from 'types/chat.types';

const ChatItemLayout = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;

  & + & {
    margin-top: 10px;
  }

  .profile-image {
    background-color: #d9d9d9;
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }
`;
const Wrapper = styled.div``;
const SpeechBubbleLayout = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 6px;
`;

const Nickname = styled.div`
  padding: 0 0 7px 3px;
  color: var(--black);
  font-size: 16px;
`;

const Bubble = styled.div<{ isMine: boolean }>`
  position: relative;
  padding: 7px 13px;
  width: fit-content;
  border-radius: ${({ isMine }) =>
    isMine ? '12px 0  12px 12px' : '0 12px 12px 12px'};
  background-color: ${({ isMine }) => (isMine ? '#FFE7B9' : 'var(--white)')};
  box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.15);
  color: var(--black);
  font-size: 18px;
`;

const Time = styled.span`
  font-size: 14px;
  color: #959595;
`;

interface Props {
  chat: Chat;
}

export default function ChatItem({ chat }: Props) {
  const userInfo = useRecoilValue(userState);
  const { sender, message, timestamp } = chat;
  const isMine = sender === userInfo?.nickname;

  return (
    <ChatItemLayout isMine={isMine}>
      {!isMine && <div className="profile-image" />}
      <Wrapper>
        {!isMine && <Nickname>{sender}</Nickname>}
        <SpeechBubbleLayout isMine={isMine}>
          <Bubble isMine={isMine}>{message}</Bubble>
          <Time>
            {timestamp && new Date(timestamp)?.toTimeString().split(' ')[0]}
          </Time>
        </SpeechBubbleLayout>
      </Wrapper>
    </ChatItemLayout>
  );
}

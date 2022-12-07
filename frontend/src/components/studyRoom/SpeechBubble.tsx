import styled from 'styled-components';
import { Chat } from 'types/chat.types';

const SpeechBubbleLayout = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  justify-content: flex-start;
  align-items: flex-end;
  gap: 6px;

  & + & {
    margin-top: 10px;
  }
`;

const Bubble = styled.div<{ isMine: boolean }>`
  position: relative;
  padding: 7px 13px;
  width: fit-content;
  border-radius: ${({ isMine }) =>
    isMine ? '12px 15px  0 12px' : '15px 12px 12px 0'};
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

export default function SpeechBubble({ chat }: Props) {
  const { sender, message, timestamp } = chat;

  return (
    <SpeechBubbleLayout isMine={sender === '멍냥'}>
      <Bubble isMine={sender === '멍냥'}>{message}</Bubble>
      <Time>
        {timestamp && new Date(timestamp)?.toTimeString().split(' ')[0]}
      </Time>
    </SpeechBubbleLayout>
  );
}

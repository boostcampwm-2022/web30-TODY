import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Chat } from 'types/chat.types';
import ChatItem from './ChatItem';

const ChatContent = styled.div`
  margin: 48px 17px 0;
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
    background: var(--orange3);
  }
  &::-webkit-scrollbar-thumb {
    margin-left: 3px;
    border-radius: 3px;
    background: var(--orange);
  }
`;

interface Props {
  sendDc: RTCDataChannel | null;
  receiveDcs: { [id: string]: RTCDataChannel };
}

export default function ChatList({ sendDc, receiveDcs }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  const chatMessageHandler = useCallback((e: MessageEvent) => {
    const body = JSON.parse(e.data);
    if (body.type !== 'chat') return;
    setChats((prev) => [...prev, body]);
  }, []);

  useEffect(() => {
    Object.values(receiveDcs).forEach((receiveDc) => {
      receiveDc.addEventListener('message', chatMessageHandler);
    });
    return () => {
      Object.values(receiveDcs).forEach((receiveDc) => {
        receiveDc.removeEventListener('message', chatMessageHandler);
      });
    };
  }, [receiveDcs]);

  useEffect(() => {
    if (!sendDc) return () => {};
    sendDc.addEventListener('message', chatMessageHandler);
    return () => {
      sendDc.removeEventListener('message', chatMessageHandler);
    };
  }, [sendDc]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <ChatContent ref={chatListRef}>
      {chats.map((chat: Chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ChatContent>
  );
}

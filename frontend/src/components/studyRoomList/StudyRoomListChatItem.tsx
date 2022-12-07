import styled from 'styled-components';

const ChatItem = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
`;

interface Props {
  name: string;
  content: string;
}

export default function StudyRoomListChatItem(props: Props) {
  const { name, content } = props;
  return (
    <ChatItem>
      {name} : {content}
    </ChatItem>
  );
}

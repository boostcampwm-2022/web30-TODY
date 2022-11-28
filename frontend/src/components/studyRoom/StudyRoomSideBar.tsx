import styled from 'styled-components';

const StudyRoomSideBarLayout = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-left: 1px solid var(--yellow);
`;
const ChatTitle = styled.h1`
  margin-top: 20px;
  margin-left: 24px;
  font-family: 'yg-jalnan';
  font-size: 18px;
  font-weight: 700;
`;

const ChatContent = styled.div`
  margin-top: 48px;
  margin-left: 17px;
  flex: 1;
`;

const ChatInputLayout = styled.div`
  margin: 0 15px;
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
  padding: 5px 10px;
  border: 1px solid #ffce70;
  border-radius: 5px;
  font-size: 16px;
`;

export default function StudyRoomSideBar() {
  return (
    <StudyRoomSideBarLayout>
      <ChatTitle>채팅</ChatTitle>
      <ChatContent> 채팅 내역</ChatContent>
      <ChatInputLayout>
        <SelectReceiverLayout>
          <span className="to">To.</span>
          <SelectReceiver id="">
            <option value="all">모두에게</option>
          </SelectReceiver>
        </SelectReceiverLayout>

        <ChatInput type="text" placeholder="메세지를 입력하세요." />
      </ChatInputLayout>
    </StudyRoomSideBarLayout>
  );
}

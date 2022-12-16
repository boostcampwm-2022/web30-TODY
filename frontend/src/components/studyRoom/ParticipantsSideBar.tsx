import styled from 'styled-components';

const ParticipantsSideBarLayout = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-left: 1px solid var(--yellow);

  &.hide {
    display: none;
  }
`;
const Title = styled.h1`
  margin-top: 20px;
  margin-left: 24px;
  font-family: 'yg-jalnan';
  font-size: 18px;
  font-weight: 700;
`;

const Content = styled.div`
  margin: 48px 17px 0;
  flex: 1;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & + & {
    margin-top: 15px;
  }
`;
const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  background-color: var(--guideText);
  border-radius: 100%;
`;
const NickName = styled.div`
  font-size: 21px;
`;

interface Props {
  participants: string[];
  isShow: boolean;
}

export default function ParticipantsSideBar({ participants, isShow }: Props) {
  const participantsList = participants ? Object.values(participants) : [];
  return (
    <ParticipantsSideBarLayout className={isShow ? '' : 'hide'}>
      <Title>참여자 목록</Title>
      <Content>
        {participantsList.map((participant: string) => (
          <ParticipantItem key={participant}>
            <ProfileImage />
            <NickName>{participant}</NickName>
          </ParticipantItem>
        ))}
      </Content>
    </ParticipantsSideBarLayout>
  );
}

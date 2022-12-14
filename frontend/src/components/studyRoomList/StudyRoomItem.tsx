import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UserIcon from '@assets/icons/user.svg';
import KingIcon from '@assets/icons/king.svg';
import ParticipantsIcon from '@assets/icons/participants.svg';
import HashTagIcon from '@assets/icons/hashtag.svg';

const StudyRoomItemLayout = styled.div`
  padding: 15px 13px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  background-color: #ffc737;
  border-radius: 10px;
  cursor: pointer;
`;

const NameLayout = styled.div`
  margin: 12px 0 10px;
`;
const Name = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 700;
  font-size: 20px;
  padding-left: 15px;
`;
const NameDeco = styled.div`
  height: 10px;
  background-color: #ffeec3;
  margin-top: -7px;
`;

const ManagerLayout = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 16px;
`;

const PersonStatusBox = styled.div`
  padding: 0 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 31px;
  background-color: #fff1d7;
  border-radius: 6px;
  font-size: 16px;
`;

const HashTagLayout = styled.div`
  display: flex;
  img {
    margin-right: 7px;
  }
`;

const Tag = styled.div`
  width: fit-content;
  padding: 6px 12px;
  color: var(--white);
  font-size: 16px;
  background-color: #ff7426;
  border-radius: 25px;

  & + & {
    margin-left: 4px;
  }
`;

interface Props {
  name: string;
  content: string;
  maxPersonnel: number;
  currentPersonnel: number;
  managerNickname: string;
  tags: string[];
  nickNameOfParticipants: string[];
  created: string;
  studyRoomId: number;
}

export default function StudyRoomItem(props: Props) {
  const {
    name,
    content,
    maxPersonnel,
    currentPersonnel,
    managerNickname,
    tags,
    nickNameOfParticipants,
    created,
    studyRoomId,
  } = props;

  const navigate = useNavigate();
  return (
    <StudyRoomItemLayout
      onClick={() => {
        navigate(`/study-room/${studyRoomId}`, {
          state: props,
        });
      }}>
      <NameLayout>
        <Name>{name}</Name>
        <NameDeco />
      </NameLayout>

      <div className="flex-row space-between">
        <ManagerLayout>
          <img src={UserIcon} alt="사용자 아이콘" />
          {managerNickname}
          <img src={KingIcon} alt="방장 아이콘" />
        </ManagerLayout>
        <div className="flex-row">
          <PersonStatusBox>
            {currentPersonnel}/{maxPersonnel}
          </PersonStatusBox>
          <PersonStatusBox>
            <img src={ParticipantsIcon} alt="참가자 정보 아이콘" />
          </PersonStatusBox>
        </div>
      </div>
      <HashTagLayout>
        <img src={HashTagIcon} alt="태그 아이콘" />
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </HashTagLayout>
    </StudyRoomItemLayout>
  );
}

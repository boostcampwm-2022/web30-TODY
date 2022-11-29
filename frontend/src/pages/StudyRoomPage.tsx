import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as MicIcon } from '@assets/icons/mic.svg';
import { ReactComponent as MicOffIcon } from '@assets/icons/mic-off.svg';
import { ReactComponent as VideoIcon } from '@assets/icons/video.svg';
import { ReactComponent as VideoOffIcon } from '@assets/icons/video-off.svg';
import { ReactComponent as CanvasIcon } from '@assets/icons/canvas.svg';
import { ReactComponent as ChatIcon } from '@assets/icons/chat.svg';
import { ReactComponent as ParticipantsIcon } from '@assets/icons/participants.svg';
import ChatSideBar from '@components/studyRoom/ChatSideBar';

const StudyRoomPageLayout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--yellow3);
`;

const RoomInfo = styled.div`
  margin-top: 24px;
  margin-left: 24px;
  display: flex;
  gap: 7px;
`;

const RoomTitle = styled.h1`
  font-family: 'yg-jalnan';
  font-size: 22px;
  font-weight: 700;
`;

const RoomStatus = styled.div`
  width: 42px;
  height: 24px;
  background-color: var(--grey);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
`;

const VideoListLayout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VideoList = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
`;
const VideoItem = styled.div`
  width: 405px;
  height: 308px;
  border-radius: 12px;
  background-color: var(--guideText);
`;

const BottomBarLayout = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 96px;
  background-color: var(--yellow);
`;

const MenuList = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;
const MenuItem = styled.button`
  width: 110px;
  height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  align-items: center;
  background: none;
  padding: 0;
  border-radius: 10px;
  font-size: 17px;

  &:hover,
  .active {
    background: rgba(255, 255, 255, 0.45);
  }
`;

const IconWrapper = styled.span`
  height: 27.5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoomExitButton = styled.button`
  position: absolute;
  top: 0;
  right: 30px;
  transform: translate(0, 50%);
  width: 108px;
  height: 46px;
  background-color: var(--orange);
  border-radius: 8px;
  color: var(--white);
  font-family: 'yg-jalnan';
  font-size: 20px;
  font-weight: 700;
`;

export default function StudyRoomPage() {
  const { roomId } = useParams();

  console.log(roomId);

  return (
    <StudyRoomPageLayout>
      <Content>
        <VideoListLayout>
          <RoomInfo>
            <RoomTitle>공부방 이름</RoomTitle>
            <RoomStatus>4/5</RoomStatus>
          </RoomInfo>
          <VideoList>
            <VideoItem />
            <VideoItem />
          </VideoList>
        </VideoListLayout>
        <ChatSideBar />
      </Content>
      <BottomBarLayout>
        <MenuList>
          <MenuItem>
            <IconWrapper>
              <MicIcon />
            </IconWrapper>
            마이크 끄기
          </MenuItem>
          {/* <MenuItem>
            <IconWrapper>
              <MicOffIcon />
            </IconWrapper>
            마이크 켜기
          </MenuItem> */}
          <MenuItem>
            <IconWrapper>
              <VideoIcon />
            </IconWrapper>
            비디오 끄기
          </MenuItem>
          {/* <MenuItem>
            <IconWrapper>
              <VideoOffIcon />
            </IconWrapper>
            비디오 켜기
          </MenuItem> */}
          <MenuItem>
            <IconWrapper>
              <CanvasIcon />
            </IconWrapper>
            캔버스 공유
          </MenuItem>
          <MenuItem>
            <IconWrapper>
              <ChatIcon />
            </IconWrapper>
            채팅
          </MenuItem>
          <MenuItem>
            <IconWrapper>
              <ParticipantsIcon />
            </IconWrapper>
            멤버
          </MenuItem>
        </MenuList>
        <RoomExitButton>나가기</RoomExitButton>
      </BottomBarLayout>
    </StudyRoomPageLayout>
  );
}

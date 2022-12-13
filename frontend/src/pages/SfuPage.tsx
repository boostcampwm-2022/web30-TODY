import styled from 'styled-components';
import { ReactComponent as MicIcon } from '@assets/icons/mic.svg';
import { ReactComponent as MicOffIcon } from '@assets/icons/mic-off.svg';
import { ReactComponent as VideoIcon } from '@assets/icons/video.svg';
import { ReactComponent as VideoOffIcon } from '@assets/icons/video-off.svg';
import { ReactComponent as CanvasIcon } from '@assets/icons/canvas.svg';
import { ReactComponent as ChatIcon } from '@assets/icons/chat.svg';
import { ReactComponent as ParticipantsIcon } from '@assets/icons/participants.svg';
import { ReactComponent as MonitorIcon } from '@assets/icons/monitor.svg';
import { ReactComponent as MonitorOffIcon } from '@assets/icons/monitor-off.svg';
import ChatSideBar from '@components/studyRoom/ChatSideBar';
import RemoteVideo from '@components/studyRoom/RemoteVideo';
import { useSfu } from '@hooks/useSfu';
import { useStudyRoomPage } from '@hooks/useStudyRoomPage';
import ParticipantsSideBar from '@components/studyRoom/ParticipantsSideBar';
import Canvas from '@components/studyRoom/Canvas';
import Loader from '@components/common/Loader';

const StudyRoomPageLayout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--yellow3);
`;

const RoomInfo = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
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
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
`;
const VideoList = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
`;
const VideoItem = styled.video`
  height: 308px;
  border-radius: 12px;
`;

const VideoListLayout = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 58px 10px 10px;

  &.activeCanvas {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    gap: 25px;

    ${VideoList} {
      max-height: 100%;
      max-width: 284px;
      min-width: 135px;
      overflow-y: auto;
    }
    ${VideoItem} {
      width: 100%;
      height: auto;
    }
  }
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
  &.active {
    background: rgba(255, 255, 255, 0.45);
  }
  &.text-red {
    color: var(--red);
    path {
      fill: var(--red);
    }
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
const RoomDeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 170px;
  transform: translate(0, 50%);
  width: 108px;
  height: 46px;
  background-color: var(--red);
  border-radius: 8px;
  color: var(--white);
  font-family: 'yg-jalnan';
  font-size: 20px;
  font-weight: 700;
`;

export default function SfuPage() {
  const {
    roomInfo,
    user,
    isMaster,
    myMediaState,
    isActiveCanvas,
    activeSideBar,
    onClickButtons,
    deleteRoom,
    leaveRoom,
  } = useStudyRoomPage();

  const {
    remoteStreams,
    chatList,
    userList,
    receiveDcs,
    sendDcRef,
    myVideoRef,
    isScreenShare,
    toggleScreenShare,
  } = useSfu(roomInfo, user, myMediaState);

  if (!roomInfo) {
    return <Loader />;
  }

  return (
    <StudyRoomPageLayout>
      <Content>
        <RoomInfo>
          <RoomTitle>{roomInfo.name}</RoomTitle>
          <RoomStatus>
            {userList.length}/{roomInfo.maxPersonnel}
          </RoomStatus>
        </RoomInfo>
        <VideoListLayout className={isActiveCanvas ? 'activeCanvas' : ''}>
          <VideoList>
            <VideoItem autoPlay ref={myVideoRef} />
            {Object.entries(remoteStreams).map(([peerId, remoteStream]) => (
              <RemoteVideo
                key={peerId}
                remoteStream={remoteStream}
                className={isActiveCanvas ? 'activeCanvas' : ''}
              />
            ))}
          </VideoList>
          <Canvas
            sendDcRef={sendDcRef}
            receiveDcs={receiveDcs}
            isActive={isActiveCanvas}
          />
        </VideoListLayout>
        {activeSideBar !== '' &&
          (activeSideBar === '채팅' ? (
            <ChatSideBar sendDcRef={sendDcRef} chatList={chatList} />
          ) : (
            <ParticipantsSideBar participants={userList} />
          ))}
      </Content>
      <BottomBarLayout>
        <MenuList onClick={onClickButtons}>
          {myMediaState.mic ? (
            <MenuItem>
              <IconWrapper>
                <MicIcon />
              </IconWrapper>
              마이크 끄기
            </MenuItem>
          ) : (
            <MenuItem className="text-red">
              <IconWrapper>
                <MicOffIcon />
              </IconWrapper>
              마이크 켜기
            </MenuItem>
          )}
          {myMediaState.video ? (
            <MenuItem>
              <IconWrapper>
                <VideoIcon />
              </IconWrapper>
              비디오 끄기
            </MenuItem>
          ) : (
            <MenuItem className="text-red">
              <IconWrapper>
                <VideoOffIcon />
              </IconWrapper>
              비디오 켜기
            </MenuItem>
          )}
          {isScreenShare ? (
            <MenuItem onClick={toggleScreenShare}>
              <IconWrapper>
                <MonitorIcon />
              </IconWrapper>
              화면 공유
            </MenuItem>
          ) : (
            <MenuItem className="text-red" onClick={toggleScreenShare}>
              <IconWrapper>
                <MonitorOffIcon />
              </IconWrapper>
              화면 공유
            </MenuItem>
          )}
          <MenuItem className={isActiveCanvas ? 'active' : ''}>
            <IconWrapper>
              <CanvasIcon />
            </IconWrapper>
            캔버스 공유
          </MenuItem>
          <MenuItem className={activeSideBar === '채팅' ? 'active' : ''}>
            <IconWrapper>
              <ChatIcon />
            </IconWrapper>
            채팅
          </MenuItem>
          <MenuItem className={activeSideBar === '멤버' ? 'active' : ''}>
            <IconWrapper>
              <ParticipantsIcon />
            </IconWrapper>
            멤버
          </MenuItem>
        </MenuList>
        <RoomExitButton onClick={leaveRoom}>나가기</RoomExitButton>
        {isMaster ? (
          <RoomDeleteButton onClick={deleteRoom}>삭제</RoomDeleteButton>
        ) : null}
      </BottomBarLayout>
    </StudyRoomPageLayout>
  );
}

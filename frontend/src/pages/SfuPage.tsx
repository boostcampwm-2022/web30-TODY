import styled from 'styled-components';
import ChatSideBar from '@components/studyRoom/ChatSideBar';
import RemoteVideo from '@components/studyRoom/RemoteVideo';
import { useSfu } from '@hooks/useSfu';
import { useStudyRoomPage } from '@hooks/useStudyRoomPage';
import ParticipantsSideBar from '@components/studyRoom/ParticipantsSideBar';
import Canvas from '@components/studyRoom/Canvas';
import Loader from '@components/common/Loader';
import BottomBar from '@components/studyRoom/BottomBar';
import NicknameWrapper from '@components/studyRoom/NicknameWrapper';

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
  width: 100%;

  &.alone {
    width: 40%;
  }

  & > div {
    flex-basis: 200px;
    flex-grow: 1;
    height: auto;
  }
`;

const VideoItem = styled.video`
  width: 100%;
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
  }
`;

const BlankBox = styled.div`
  background-color: var(--yellow);
  padding-top: 75%;
  border-radius: 12px;
`;

export default function SfuPage() {
  const {
    roomInfo,
    user,
    isActiveCanvas,
    activeSideBar,
    setIsActiveCanvas,
    setActiveSideBar,
  } = useStudyRoomPage();

  const {
    myStream,
    remoteStreams,
    userList,
    receiveDcs,
    sendDc,
    myVideoRef,
    isScreenShare,
    noCamPeerIds,
    nicknameRef,
    isCameraUsable,
    setIsScreenShare,
  } = useSfu(roomInfo, user);

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
          <VideoList
            className={
              !Object.keys(remoteStreams).length && !noCamPeerIds.length
                ? 'alone'
                : ''
            }>
            <NicknameWrapper nickname={user?.nickname}>
              {isCameraUsable || isScreenShare ? (
                <VideoItem muted autoPlay ref={myVideoRef} />
              ) : (
                <BlankBox />
              )}
            </NicknameWrapper>
            {Object.entries(remoteStreams).map(([peerId, remoteStream]) => (
              <NicknameWrapper
                key={peerId}
                nickname={nicknameRef.current[peerId]}>
                <RemoteVideo remoteStream={remoteStream} />
              </NicknameWrapper>
            ))}
            {noCamPeerIds.map((peerId) => (
              <NicknameWrapper
                key={peerId}
                nickname={nicknameRef.current[peerId]}>
                <BlankBox />
              </NicknameWrapper>
            ))}
          </VideoList>
          <Canvas
            sendDc={sendDc}
            receiveDcs={receiveDcs}
            isActive={isActiveCanvas}
          />
        </VideoListLayout>
        <ChatSideBar
          sendDc={sendDc}
          receiveDcs={receiveDcs}
          isShow={activeSideBar === 'chat'}
        />
        <ParticipantsSideBar
          participants={userList}
          isShow={activeSideBar === 'member'}
        />
      </Content>
      <BottomBar
        myStream={myStream}
        isScreenShare={isScreenShare}
        setIsScreenShare={setIsScreenShare}
        isActiveCanvas={isActiveCanvas}
        setIsActiveCanvas={setIsActiveCanvas}
        activeSideBar={activeSideBar}
        setActiveSideBar={setActiveSideBar}
      />
    </StudyRoomPageLayout>
  );
}

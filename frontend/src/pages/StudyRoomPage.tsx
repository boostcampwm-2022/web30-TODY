/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as MicIcon } from '@assets/icons/mic.svg';
import { ReactComponent as MicOffIcon } from '@assets/icons/mic-off.svg';
import { ReactComponent as VideoIcon } from '@assets/icons/video.svg';
import { ReactComponent as VideoOffIcon } from '@assets/icons/video-off.svg';
import { ReactComponent as CanvasIcon } from '@assets/icons/canvas.svg';
import { ReactComponent as ChatIcon } from '@assets/icons/chat.svg';
import { ReactComponent as ParticipantsIcon } from '@assets/icons/participants.svg';
import ChatSideBar from '@components/studyRoom/ChatSideBar';
import RemoteVideo from '@components/studyRoom/RemoteVideo';
import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import useAxios from '@hooks/useAxios';
import ParticipantsSideBar from '@components/studyRoom/ParticipantsSideBar';
import getParticipantsListRequest from '../axios/requests/getParticipantsListRequest';

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
  flex: 1;
  display: flex;
`;

const VideoListLayout = styled.div`
  flex: 1;
  display: flex;
  padding: 58px 10px 10px;
`;

const VideoList = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const VideoItem = styled.video`
  width: 405px;
  height: 308px;
  border-radius: 12px;
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

const socket = io(process.env.REACT_APP_SOCKET_URL!, {
  autoConnect: false,
});

const PCConfig = {
  iceServers: [
    { urls: 'stun:101.101.219.107:3478' },
    {
      urls: 'turn:101.101.219.107:3478',
      username: 'test',
      credential: 'test123',
    },
  ],
};

export default function StudyRoomPage() {
  const { roomId } = useParams();
  const { state: roomInfo } = useLocation();

  const [getParticipants, loading, error, participantsList] = useAxios<{
    participantsList: any;
  }>(getParticipantsListRequest);

  useEffect(() => {
    getParticipants(roomInfo.studyRoomId);
  }, []);

  const [activeSideBar, setActiveSideBar] = useState('');
  const [myMediaState, setMyMediaState] = useState({
    video: true,
    mic: true,
  });

  let sendPC: RTCPeerConnection | null = null;
  const receivePCListRef = useRef<{ [socketId: string]: RTCPeerConnection }>(
    {},
  );
  const [userList, setUserList] = useState<
    {
      socketId: string;
      stream: MediaStream;
    }[]
  >([]);

  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStreamRef = useRef<MediaStream | null>(null);

  const getLocalStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myStreamRef.current = stream;
    if (myVideoRef.current) myVideoRef.current.srcObject = stream;
  }, []);

  const createSenderOffer = useCallback(async () => {
    if (!sendPC) return;
    const sdp = await sendPC.createOffer();
    await sendPC.setLocalDescription(sdp);

    socket.emit('senderOffer', {
      senderSdp: sdp,
      roomId: roomInfo.studyRoomId,
    });
  }, []);

  const createSendPeerConnection = useCallback(async () => {
    const pc = new RTCPeerConnection(PCConfig);

    pc.onicecandidate = (e) => {
      if (!(e.candidate && socket)) return;
      socket.emit('senderCandidate', {
        candidate: e.candidate,
      });
    };

    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        if (!myStreamRef.current) return;
        pc.addTrack(track, myStreamRef.current);
      });
    }

    sendPC = pc;

    await createSenderOffer();
  }, []);

  const createReceiverOffer = useCallback(
    async (pc: any, senderSocketId: any) => {
      const sdp = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(sdp);

      if (!socket) return;
      socket.emit('receiverOffer', {
        receiverSdp: sdp,
        senderSocketId,
        roomId: roomInfo.studyRoomId,
      });
    },
    [],
  );

  const createReceivePeerConnection = useCallback((senderSocketId: string) => {
    const pc = new RTCPeerConnection(PCConfig);

    receivePCListRef.current = {
      ...receivePCListRef.current,
      [senderSocketId]: pc,
    };

    pc.onicecandidate = (e) => {
      if (!(e.candidate && socket)) return;
      socket.emit('receiverCandidate', {
        candidate: e.candidate,
        senderSocketId,
      });
    };

    pc.ontrack = (e) => {
      setUserList((prevUserList) =>
        prevUserList
          .filter((user) => user.socketId !== senderSocketId)
          .concat({
            socketId: senderSocketId,
            stream: e.streams[0],
          }),
      );
    };

    createReceiverOffer(pc, senderSocketId);
  }, []);

  const closeReceiverPeerConnection = (toCloseSocketId: string) => {
    if (!receivePCListRef.current[toCloseSocketId]) return;
    receivePCListRef.current[toCloseSocketId].close();
    delete receivePCListRef.current[toCloseSocketId];
  };

  useEffect(() => {
    socket.connect();

    socket.on('connect', async () => {
      await getLocalStream();
      createSendPeerConnection();
    });

    socket.on('enterNewUser', ({ socketId }) => {
      createReceivePeerConnection(socketId);
    });

    socket.on('userLeftRoom', ({ socketId }) => {
      closeReceiverPeerConnection(socketId);
      setUserList((prevUserList) =>
        prevUserList.filter((user) => user.socketId !== socketId),
      );
    });

    socket.on('getSenderAnswer', async ({ receiverSdp }) => {
      if (!sendPC) return;
      await sendPC.setRemoteDescription(receiverSdp);
      socket.emit('getUserList', {
        roomId: roomInfo.studyRoomId,
      });
    });

    socket.on('getSenderCandidate', async ({ candidate }) => {
      if (!(candidate && sendPC)) return;
      await sendPC.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('getReceiverAnswer', async ({ senderSocketId, senderSdp }) => {
      const pc = receivePCListRef.current[senderSocketId];
      if (!pc) return;
      await pc.setRemoteDescription(senderSdp);
    });

    socket.on('getReceiverCandidate', async ({ candidate, senderSocketId }) => {
      const pc = receivePCListRef.current[senderSocketId];
      if (!(pc && candidate)) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('allUserList', ({ allUserList }) => {
      allUserList?.forEach((user: any) =>
        createReceivePeerConnection(user.socketId),
      );
    });

    return () => {
      socket.off('connect');
      socket.off('enterNewUser');
      socket.off('userLeftRoom');
      socket.off('getSenderAnswer');
      socket.off('getSenderCandidate');
      socket.off('getReceiverAnswer');
      socket.off('getReceiverCandidate');
      socket.off('allUserList');
      socket.disconnect();

      if (sendPC) {
        sendPC.close();
      }
      userList.forEach((user) => closeReceiverPeerConnection(user.socketId));
    };
  }, []);

  function toggleMediaState(type: string) {
    if (type === 'video') {
      myStreamRef
        .current!.getVideoTracks()
        .forEach((track: MediaStreamTrack) => {
          track.enabled = !track.enabled;
        });

      setMyMediaState({
        ...myMediaState,
        video: !myMediaState.video,
      });
      return;
    }

    if (type === 'mic') {
      myStreamRef
        .current!.getAudioTracks()
        .forEach((track: MediaStreamTrack) => {
          track.enabled = !track.enabled;
        });

      setMyMediaState({
        ...myMediaState,
        mic: !myMediaState.mic,
      });
    }
  }

  const onClickSideBarMenu = (clickedMenu: string) => {
    if (clickedMenu === activeSideBar) setActiveSideBar('');
    else setActiveSideBar(clickedMenu);
  };

  const onClickButtons = (e: any) => {
    const buttonEl = e.target.closest('button').textContent;

    switch (buttonEl) {
      case '':
        break;
      case '채팅':
      case '멤버':
        onClickSideBarMenu(buttonEl);
        break;
      case '마이크 끄기':
      case '마이크 켜기':
        toggleMediaState('mic');
        break;
      case '비디오 끄기':
      case '비디오 켜기':
        toggleMediaState('video');
        break;
      default:
        break;
    }
  };

  return (
    <StudyRoomPageLayout>
      <Content>
        <RoomInfo>
          <RoomTitle>{roomInfo.name}</RoomTitle>
          <RoomStatus>4/5</RoomStatus>
        </RoomInfo>
        <VideoListLayout>
          <VideoList>
            <VideoItem muted autoPlay ref={myVideoRef} />
            {userList.map((user) => (
              <RemoteVideo key={user.socketId} remoteStream={user.stream} />
            ))}
          </VideoList>
        </VideoListLayout>
        {activeSideBar !== '' &&
          (activeSideBar === '채팅' ? (
            <ChatSideBar />
          ) : (
            <ParticipantsSideBar participants={participantsList} />
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
          <MenuItem>
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
        <RoomExitButton>나가기</RoomExitButton>
      </BottomBarLayout>
    </StudyRoomPageLayout>
  );
}

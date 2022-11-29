/* eslint-disable jsx-a11y/media-has-caption */
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
import VideoItem from '@components/studyRoom/VideoItem';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
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

const EVENTS = {
  CONNECT: 'connect',
  NOTICE_ALL_PEERS: 'notice-all-peers',
  OFFER: 'offer',
  ANSWER: 'answer',
  ICECANDIDATE: 'icecandidate',
  SOMEONE_LEFT_YOUR_ROOM: 'someone-left-your-room',
};

const socket = io(process.env.REACT_APP_SOCKET_URL!, {
  autoConnect: false,
});

interface RemoteVideoProps {
  remoteStream: MediaStream;
}

function RemoteVideo({ remoteStream }: RemoteVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    ref.current!.srcObject = remoteStream;
  }, []);

  return <video autoPlay ref={ref} width="400px" height="400px" />;
}

export default function StudyRoomPage() {
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);
  const pcs = useRef<{ [socketId: string]: RTCPeerConnection }>({});

  function addIcecandidateListener(pc: RTCPeerConnection, toId: string) {
    pc.addEventListener('icecandidate', (ice: RTCPeerConnectionIceEvent) => {
      socket.emit('icecandidate', {
        icecandidate: ice.candidate,
        fromId: socket.id,
        toId,
      });
    });
  }

  function addTrackListener(pc: RTCPeerConnection, peerId: string) {
    pc.addEventListener('track', (track: RTCTrackEvent) => {
      const remoteStream = track.streams[0];
      setRemoteStreams((prev) => {
        const next = { ...prev, [peerId]: remoteStream };
        return next;
      });
    });
  }

  useEffect(() => {
    socket.connect();

    socket.on('connect', async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      myStream.current = stream;

      console.log(myVideoRef);
      myVideoRef.current!.srcObject = myStream.current;
      console.log('test: ', myVideoRef);

      socket.emit('join', 'room1');
    });

    socket.on('notice-all-peers', (peerIdsInRoom) => {
      peerIdsInRoom.forEach(async (peerId: string) => {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcs.current[peerId] = pc;
        addIcecandidateListener(pc, peerId);
        addTrackListener(pc, peerId);

        myStream.current!.getTracks().forEach((track: MediaStreamTrack) => {
          pc.addTrack(track, myStream.current!);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('offer', { offer, fromId: socket.id, toId: peerId });
      });
    });

    socket.on('offer', async ({ offer, fromId, toId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcs.current[fromId] = pc;
      addIcecandidateListener(pc, fromId);
      addTrackListener(pc, fromId);

      myStream.current!.getTracks().forEach((track: MediaStreamTrack) => {
        pc.addTrack(track, myStream.current!);
      });

      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', { answer, fromId: socket.id, toId: fromId });
    });

    socket.on('answer', async ({ answer, fromId, toId }) => {
      const pc = pcs.current[fromId];
      await pc.setRemoteDescription(answer);
    });

    socket.on('icecandidate', async ({ icecandidate, fromId, toId }) => {
      const pc = pcs.current[fromId];
      if (!icecandidate) return;
      await pc.addIceCandidate(icecandidate);
    });

    socket.on('someone-left-your-room', (peerId) => {
      const pc = pcs.current[peerId];
      pc.close();
      delete pcs.current[peerId];

      setRemoteStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('notice-all-peers');
      socket.off('offer');
      socket.off('answer');
      socket.off('icecandidate');
      socket.off('someone-left-your-room');
      socket.disconnect();
    };
  }, []);

  const { roomId } = useParams();
  const { state: roomInfo } = useLocation();

  const [getParticipants, loading, error, participantsList] = useAxios<{
    participantsList: any;
  }>(getParticipantsListRequest);

  useEffect(() => {
    getParticipants(roomInfo.studyRoomId);
  }, []);

  useEffect(() => {}, [participantsList]);

  const [activeSideBar, setActiveSideBar] = useState('');

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
      default:
        console.log(buttonEl);
        break;
    }
  };

  return (
    <StudyRoomPageLayout>
      <Content>
        <VideoListLayout>
          <RoomInfo>
            <RoomTitle>{roomInfo.name}</RoomTitle>
            <RoomStatus>4/5</RoomStatus>
          </RoomInfo>
          <VideoList>
            <video autoPlay ref={myVideoRef} width="400px" height="400px" />
            {Object.entries(remoteStreams).map(([peerId, remoteStream]) => (
              <RemoteVideo key={peerId} remoteStream={remoteStream} />
            ))}
            {/* <VideoItem ref={myVideoRef} /> */}
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

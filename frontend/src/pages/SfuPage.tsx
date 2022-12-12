/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAxios from '@hooks/useAxios';
import SFU_EVENTS from 'constants/sfuEvents';
import { Chat } from 'types/chat.types';
import ParticipantsSideBar from '@components/studyRoom/ParticipantsSideBar';
import Canvas from '@components/studyRoom/Canvas';
import { useRecoilValue } from 'recoil';
import Loader from '@components/common/Loader';
import { userState } from 'recoil/atoms';
import checkMasterRequest from '../axios/requests/checkMasterRequest';
import enterRoomRequest from '../axios/requests/enterRoomRequest';
import leaveRoomRequest from '../axios/requests/leaveRoomRequest';
import deleteRoomRequest from '../axios/requests/deleteRoomRequest';
import getStudyRoomInfo from '../axios/requests/getStudyRoomInfoRequest';

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

const socket = io(process.env.REACT_APP_SFU_URL!, {
  autoConnect: false,
  path: '/sfu/socket.io',
});

let isPage = true;

export default function SfuPage() {
  const { roomId } = useParams();
  const [requestGetStudyRoomInfo, , , roomInfo] =
    useAxios<any>(getStudyRoomInfo);
  const user = useRecoilValue(userState);
  const [, , , enterRoomData] = useAxios<''>(enterRoomRequest, {
    onMount: true,
    arg: {
      studyRoomId: roomId,
      userId: user?.userId,
      nickname: user?.nickname,
      isMaster: true,
    },
  });

  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    if (!roomInfo) return;
    setUserList([...roomInfo.nickNameOfParticipants]);
  }, [roomInfo]);

  useEffect(() => {
    if (enterRoomData === null) return;
    requestGetStudyRoomInfo(roomId);
  }, [enterRoomData]);

  const [leaveRoom, , ,] = useAxios<void>(leaveRoomRequest);
  const [deleteRoom, , ,] = useAxios<void>(deleteRoomRequest);
  const [, , , isMaster] = useAxios<boolean>(checkMasterRequest, {
    onMount: true,
    arg: {
      studyRoomId: roomId,
      userId: user?.userId,
    },
  });

  const [activeSideBar, setActiveSideBar] = useState('');
  const [isActiveCanvas, setIsActiveCanvas] = useState(false);

  const navigate = useNavigate();

  const leaveRoomEvent = () => {
    navigate(`/study-rooms`);
  };

  useEffect(() => {
    return () => {
      if (user && isPage) {
        leaveRoom({
          studyRoomId: roomId,
          userId: user.userId,
        });
      }
    };
  }, []);

  const deleteRoomEvent = () => {
    if (!window.confirm('방을 삭제하시겠습니까?')) return;
    alert('방이 삭제되었습니다.');
    if (user) {
      socket.emit('deleteRoom', roomId);
      deleteRoom({
        studyRoomId: roomId,
      });
      isPage = false;
    }
    navigate(`/study-rooms`);
  };

  const [myMediaState, setMyMediaState] = useState({
    video: true,
    mic: false,
  });

  const [screenShare, setScreenShare] = useState({
    use: false,
  });

  const RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const [chatList, setChatList] = useState<Chat[]>([]);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);
  const receivePcs = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const [receiveDcs, setReceiveDcs] = useState<{
    [socketId: string]: RTCDataChannel;
  }>({});
  const sendPcRef = useRef<RTCPeerConnection | null>(null);
  const sendDcRef = useRef<RTCDataChannel | null>(null);

  const createSender = useCallback(async () => {
    const sendPc = new RTCPeerConnection(RTCConfiguration);
    sendPcRef.current = sendPc;
    sendPc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      socket.emit(SFU_EVENTS.SENDER_ICECANDIDATE, {
        icecandidate: ice.candidate,
      });
    };

    if (myStream.current) {
      myStream.current.getTracks().forEach((track: MediaStreamTrack) => {
        sendPc.addTrack(track, myStream.current!);
      });
    }

    const senderDc = sendPc.createDataChannel('chat');
    sendDcRef.current = senderDc;
    senderDc.onmessage = (e) => {
      const body = JSON.parse(e.data);
      if (body.type === 'chat') {
        setChatList((prev) => [...prev, body]);
      }
    };

    const offer = await sendPc.createOffer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
    });
    await sendPc.setLocalDescription(offer);
    return offer;
  }, []);

  const createReceiver = useCallback(async (peerId: string) => {
    const receivePc = new RTCPeerConnection(RTCConfiguration);
    receivePcs.current[peerId] = receivePc;
    receivePc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      socket.emit(SFU_EVENTS.RECEIVER_ICECANDIDATE, {
        icecandidate: ice.candidate,
        peerId,
      });
    };
    receivePc.ontrack = (track: RTCTrackEvent) => {
      const remoteStream = track.streams[0];
      setRemoteStreams((prev) => {
        const next = { ...prev, [peerId]: remoteStream };
        return next;
      });
    };

    const receiveDc = receivePc.createDataChannel('chat');
    setReceiveDcs((prev) => ({ ...prev, [peerId]: receiveDc }));
    receiveDc.onmessage = (e: any) => {
      const body = JSON.parse(e.data);
      if (body.type === 'chat') {
        setChatList((prev) => [...prev, body]);
      }
    };

    const offer = await receivePc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await receivePc.setLocalDescription(offer);
    return offer;
  }, []);

  useEffect(() => {
    if (!user || !roomInfo) return;
    console.log();
    socket.connect();

    socket.on(SFU_EVENTS.CONNECT, async () => {
      try {
        const stream = screenShare.use
          ? await navigator.mediaDevices.getDisplayMedia()
          : await navigator.mediaDevices.getUserMedia({
              video: myMediaState.video,
              audio: myMediaState.mic,
            });
        myStream.current = stream;

        if (!myVideoRef.current) return;
        myVideoRef.current!.srcObject = myStream.current;
      } catch (err) {
        alert('사용 가능한 카메라가 없습니다.');
      } finally {
        socket.emit(SFU_EVENTS.JOIN, roomId);

        const offer = await createSender();
        socket.emit(SFU_EVENTS.SENDER_OFFER, {
          offer,
          userData: {
            userId: user.userId,
            userName: user.nickname,
            roomId,
          },
        });
      }
    });

    socket.on(SFU_EVENTS.NOTICE_ALL_PEERS, (peerIdsInRoom) => {
      peerIdsInRoom.forEach(async (peerId: string) => {
        const offer = await createReceiver(peerId);
        socket.emit(SFU_EVENTS.RECEIVER_OFFER, {
          offer,
          targetId: peerId,
        });
      });
    });

    socket.on(SFU_EVENTS.SENDER_ANSWER, ({ answer }) => {
      sendPcRef.current?.setRemoteDescription(answer);
    });

    socket.on(SFU_EVENTS.RECEIVER_ANSWER, ({ answer, targetId }) => {
      receivePcs.current![targetId].setRemoteDescription(answer);
    });

    socket.on(SFU_EVENTS.NEW_PEER, async ({ peerId, userName }) => {
      setUserList((prev: any) => [...prev, userName]);
      const offer = await createReceiver(peerId);
      socket.emit(SFU_EVENTS.RECEIVER_OFFER, {
        offer,
        targetId: peerId,
      });
    });

    socket.on(
      SFU_EVENTS.SENDER_ICECANDIDATE,
      async ({ icecandidate, targetId }) => {
        const receivePc = receivePcs.current[targetId];
        if (!icecandidate) return;
        await receivePc.addIceCandidate(icecandidate);
      },
    );

    socket.on(SFU_EVENTS.RECEIVER_ICECANDIDATE, async ({ icecandidate }) => {
      if (!icecandidate) return;
      await sendPcRef.current!.addIceCandidate(icecandidate);
    });

    socket.on(SFU_EVENTS.SOMEONE_LEFT_ROOM, ({ peerId, userName }) => {
      setUserList((prev: any) => [...prev.filter((x: any) => x !== userName)]);
      const receivePc = receivePcs.current[peerId];
      receivePc.close();
      delete receivePcs.current[peerId];

      setReceiveDcs((cur) => {
        const newReceiveDcs = { ...cur };
        delete newReceiveDcs[peerId];
        return newReceiveDcs;
      });

      setRemoteStreams((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    });

    socket.on('deletedThisRoom', () => {
      alert('방장이 공부방을 삭제했습니다 :(');
      leaveRoomEvent();
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off(SFU_EVENTS.CONNECT);
      socket.off(SFU_EVENTS.NOTICE_ALL_PEERS);
      socket.off(SFU_EVENTS.RECEIVER_ANSWER);
      socket.off(SFU_EVENTS.SENDER_ANSWER);
      socket.off(SFU_EVENTS.RECEIVER_ICECANDIDATE);
      socket.off(SFU_EVENTS.SENDER_ICECANDIDATE);
      socket.off(SFU_EVENTS.NEW_PEER);
      socket.off(SFU_EVENTS.SOMEONE_LEFT_ROOM);

      socket.disconnect();
    };
  }, [screenShare, roomInfo]);

  async function toggleMediaState(type: string) {
    if (type === 'video') {
      myStream.current!.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });

      setMyMediaState({
        ...myMediaState,
        video: !myMediaState.video,
      });
      return;
    }

    if (type === 'mic') {
      myStream.current!.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });

      setMyMediaState({
        ...myMediaState,
        mic: !myMediaState.mic,
      });
    }

    if (type === 'screen') {
      setScreenShare({
        ...screenShare,
        use: !screenShare.use,
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
      case '화면 공유':
        toggleMediaState('screen');
        break;
      case '캔버스 공유':
        setIsActiveCanvas(!isActiveCanvas);
        break;
      default:
        break;
    }
  };

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
            <VideoItem muted autoPlay ref={myVideoRef} />
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
          {screenShare.use ? (
            <MenuItem>
              <IconWrapper>
                <MonitorIcon />
              </IconWrapper>
              화면 공유
            </MenuItem>
          ) : (
            <MenuItem className="text-red">
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
        <RoomExitButton onClick={leaveRoomEvent}>나가기</RoomExitButton>
        {isMaster ? (
          <RoomDeleteButton onClick={deleteRoomEvent}>삭제</RoomDeleteButton>
        ) : null}
      </BottomBarLayout>
    </StudyRoomPageLayout>
  );
}

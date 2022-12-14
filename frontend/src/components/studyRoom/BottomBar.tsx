/* eslint-disable no-param-reassign */
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
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '@hooks/useAxios';
import socket from 'sockets/sfuSocket';
import Loader from '@components/common/Loader';
import deleteRoomRequest from '../../axios/requests/deleteRoomRequest';
import checkMasterRequest from '../../axios/requests/checkMasterRequest';

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
      color: var(--red);
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

interface Props {
  myStream: RefObject<MediaStream | null>;
  isScreenShare: boolean;
  setIsScreenShare: Dispatch<SetStateAction<boolean>>;
  setIsActiveCanvas: Dispatch<SetStateAction<boolean>>;
  isActiveCanvas: boolean;
  activeSideBar: string;
  setActiveSideBar: Dispatch<React.SetStateAction<string>>;
}

export default function BottomBar({
  myStream,
  isScreenShare,
  setIsScreenShare,
  setIsActiveCanvas,
  isActiveCanvas,
  activeSideBar,
  setActiveSideBar,
}: Props) {
  const { roomId } = useParams();
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [myMediaState, setMyMediaState] = useState({ mic: false, video: true });
  const [requestDeleteRoom, deleteRoomLoading, , deleteRoomData] =
    useAxios<''>(deleteRoomRequest);
  const [, , , isMaster] = useAxios<boolean>(checkMasterRequest, {
    onMount: true,
    arg: {
      studyRoomId: roomId,
      userId: user?.userId,
    },
  });

  const toggleScreenShare = useCallback(() => {
    setIsScreenShare(!isScreenShare);
  }, [isScreenShare]);

  const leaveRoom = useCallback(() => {
    navigate(`/study-rooms`);
  }, []);

  const deleteRoom = useCallback(() => {
    if (!window.confirm('?????? ?????????????????????????')) return;
    requestDeleteRoom({
      studyRoomId: roomId,
    });
  }, []);

  useEffect(() => {
    socket.on('deletedThisRoom', () => {
      alert('????????? ???????????? ?????????????????? :(');
      leaveRoom();
    });
    return () => {
      socket.off('deletedThisRoom');
    };
  }, []);

  useEffect(() => {
    if (deleteRoomData === null) return;
    alert('?????? ?????????????????????.');
    socket.emit('deleteRoom', roomId);
    navigate(`/study-rooms`, { replace: true });
  }, [deleteRoomData]);

  useEffect(() => {
    if (!myStream.current) return;
    myStream.current.getAudioTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = myMediaState.mic;
    });

    myStream.current.getVideoTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = myMediaState.video;
    });
  }, [myMediaState]);

  const toggleMediaState = useCallback(
    (type: 'video' | 'mic') => {
      switch (type) {
        case 'video':
          setMyMediaState({
            ...myMediaState,
            video: !myMediaState.video,
          });
          break;
        case 'mic':
          setMyMediaState({
            ...myMediaState,
            mic: !myMediaState.mic,
          });
          break;
        default:
          break;
      }
    },
    [myMediaState],
  );

  const onClickSideBarMenu = useCallback(
    (clickedMenu: string) => {
      if (clickedMenu === activeSideBar) setActiveSideBar('');
      else setActiveSideBar(clickedMenu);
    },
    [activeSideBar],
  );

  const onClickButtons = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as Element;
      const buttonName = target.closest('button')?.name;

      switch (buttonName) {
        case '':
          break;
        case 'chat':
        case 'member':
          onClickSideBarMenu(buttonName);
          break;
        case 'mic':
        case 'video':
          toggleMediaState(buttonName);
          break;
        case 'canvas':
          setIsActiveCanvas(!isActiveCanvas);
          break;
        default:
          break;
      }
    },
    [isActiveCanvas, onClickSideBarMenu, toggleMediaState],
  );

  return (
    <BottomBarLayout>
      {deleteRoomLoading && <Loader />}
      <MenuList onClick={onClickButtons}>
        <MenuItem name="mic" className={myMediaState.mic ? '' : 'text-red'}>
          <IconWrapper>
            {myMediaState.mic ? <MicIcon /> : <MicOffIcon />}
          </IconWrapper>
          ????????? {myMediaState.mic ? '??????' : '??????'}
        </MenuItem>
        <MenuItem name="video" className={myMediaState.video ? '' : 'text-red'}>
          <IconWrapper>
            {myMediaState.video ? <VideoIcon /> : <VideoOffIcon />}
          </IconWrapper>
          ????????? {myMediaState.video ? '??????' : '??????'}
        </MenuItem>
        <MenuItem
          onClick={toggleScreenShare}
          className={isScreenShare ? '' : 'text-red'}>
          <IconWrapper>
            {isScreenShare ? <MonitorIcon /> : <MonitorOffIcon />}
          </IconWrapper>
          ?????? ??????
        </MenuItem>
        <MenuItem name="canvas" className={isActiveCanvas ? 'active' : ''}>
          <IconWrapper>
            <CanvasIcon />
          </IconWrapper>
          ????????? ??????
        </MenuItem>
        <MenuItem
          name="chat"
          className={activeSideBar === 'chat' ? 'active' : ''}>
          <IconWrapper>
            <ChatIcon />
          </IconWrapper>
          ??????
        </MenuItem>
        <MenuItem
          name="member"
          className={activeSideBar === 'member' ? 'active' : ''}>
          <IconWrapper>
            <ParticipantsIcon />
          </IconWrapper>
          ??????
        </MenuItem>
      </MenuList>
      <RoomExitButton onClick={leaveRoom}>?????????</RoomExitButton>
      {isMaster ? (
        <RoomDeleteButton onClick={deleteRoom}>??????</RoomDeleteButton>
      ) : null}
    </BottomBarLayout>
  );
}

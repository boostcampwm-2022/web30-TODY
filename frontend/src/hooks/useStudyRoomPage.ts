import { useEffect, useState } from 'react';
import useAxios from '@hooks/useAxios';
import SFU_EVENTS from 'constants/sfuEvents';
import { userState } from 'recoil/atoms';
import { useRecoilValue } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import socket from 'sockets/sfuSocket';
import enterRoomRequest from '../axios/requests/enterRoomRequest';
import getStudyRoomInfoRequest from '../axios/requests/getStudyRoomInfoRequest';
import deleteRoomRequest from '../axios/requests/deleteRoomRequest';
import checkMasterRequest from '../axios/requests/checkMasterRequest';

export function useStudyRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [activeSideBar, setActiveSideBar] = useState('');
  const [isActiveCanvas, setIsActiveCanvas] = useState(false);
  const [myMediaState, setMyMediaState] = useState({
    video: true,
    mic: false,
    screenShare: false,
  });
  const [requestDeleteRoom, , , deleteRoomData] =
    useAxios<''>(deleteRoomRequest);
  const [requestGetStudyRoomInfo, , , roomInfo] = useAxios<any>(
    getStudyRoomInfoRequest,
  );
  const [, , , enterRoomData] = useAxios<''>(enterRoomRequest, {
    onMount: true,
    arg: {
      studyRoomId: roomId,
      userId: user?.userId,
      nickname: user?.nickname,
      isMaster: true,
    },
  });
  const [, , , isMaster] = useAxios<boolean>(checkMasterRequest, {
    onMount: true,
    arg: {
      studyRoomId: roomId,
      userId: user?.userId,
    },
  });

  useEffect(() => {
    if (enterRoomData === null) return;
    requestGetStudyRoomInfo(roomId);
  }, [enterRoomData]);

  const leaveRoom = () => {
    navigate(`/study-rooms`);
  };

  useEffect(() => {
    socket.on('deletedThisRoom', () => {
      alert('방장이 공부방을 삭제했습니다 :(');
      leaveRoom();
    });
  }, []);

  useEffect(() => {
    if (deleteRoomData === null) return;
    alert('방이 삭제되었습니다.');
    socket.emit('deleteRoom', roomId);
    navigate(`/study-rooms`);
  }, [deleteRoomData]);

  const deleteRoom = () => {
    if (!window.confirm('방을 삭제하시겠습니까?')) return;
    requestDeleteRoom({
      studyRoomId: roomId,
    });
  };

  async function toggleMediaState(type: 'video' | 'mic') {
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
      case '캔버스 공유':
        setIsActiveCanvas(!isActiveCanvas);
        break;
      default:
        break;
    }
  };

  return {
    roomInfo,
    user,
    isMaster,
    myMediaState,
    setMyMediaState,
    isActiveCanvas,
    activeSideBar,
    onClickButtons,
    deleteRoom,
    leaveRoom,
  };
}

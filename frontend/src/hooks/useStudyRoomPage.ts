import { useEffect, useState } from 'react';
import useAxios from '@hooks/useAxios';
import { userState } from 'recoil/atoms';
import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';
import { RoomInfoData } from 'types/studyRoom.types';
import enterRoomRequest from '../axios/requests/enterRoomRequest';
import getStudyRoomInfoRequest from '../axios/requests/getStudyRoomInfoRequest';

export function useStudyRoomPage() {
  const { roomId } = useParams();
  const user = useRecoilValue(userState);
  const [activeSideBar, setActiveSideBar] = useState('');
  const [isActiveCanvas, setIsActiveCanvas] = useState(false);
  const [requestGetStudyRoomInfo, , , roomInfo] = useAxios<RoomInfoData>(
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

  useEffect(() => {
    if (enterRoomData === null) return;
    requestGetStudyRoomInfo(roomId);
  }, [enterRoomData]);

  return {
    roomInfo,
    user,
    isActiveCanvas,
    activeSideBar,
    setIsActiveCanvas,
    setActiveSideBar,
  };
}

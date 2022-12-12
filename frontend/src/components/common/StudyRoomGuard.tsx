import useAxios from '@hooks/useAxios';
import { Navigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import checkIsInRoom from '../../axios/requests/checkIsInRoomRequest';
import checkIsFull from '../../axios/requests/checkIsFullRequest';
import Loader from './Loader';

const notifications = {
  isAlreadyInRoom: '이미 다른 방에 참여중입니다.',
  roomIsFull: '방 최대 인원수가 초과했습니다.',
};

interface Props {
  children: JSX.Element;
}

export default function BlockRoomEnter({ children }: Props) {
  const { roomId } = useParams();
  const user = useRecoilValue(userState);

  const [, checkIsInRoomLoading, , checkIsInRoomData] = useAxios<boolean | ''>(
    checkIsInRoom,
    { onMount: true, arg: user?.userId },
  );
  const [, checkIsFullLoading, , checkIsFullData] = useAxios<{
    isFull: boolean;
  }>(checkIsFull, { onMount: true, arg: { studyRoomId: roomId } });

  if (checkIsFullLoading || checkIsInRoomLoading) {
    return <Loader />;
  }

  // if (checkIsInRoomData?.valueOf() === true) {
  //   alert(notifications.isAlreadyInRoom);
  //   return <Navigate to="/study-rooms" />;
  // }

  // if (checkIsFullData?.isFull) {
  //   alert(notifications.roomIsFull);
  //   return <Navigate to="/study-rooms" />;
  // }

  return children;
}

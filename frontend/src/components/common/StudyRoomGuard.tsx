import useAxios from '@hooks/useAxios';
import { Navigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import Loader from './Loader';
import checkEnterableRequest from '../../axios/requests/checkEnterableRequest';

interface Props {
  children: JSX.Element;
}

export default function BlockRoomEnter({ children }: Props) {
  const { roomId } = useParams();
  const user = useRecoilValue(userState);

  const [, loading, error] = useAxios<{
    enterable: boolean;
  }>(checkEnterableRequest, {
    onMount: true,
    arg: { roomId, userId: user?.userId },
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    alert(error.message);
    return <Navigate to="/study-rooms" />;
  }

  return children;
}

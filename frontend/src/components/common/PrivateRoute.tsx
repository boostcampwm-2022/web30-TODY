import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute(props: Props) {
  const { children } = props;
  const user = useRecoilValue(userState);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

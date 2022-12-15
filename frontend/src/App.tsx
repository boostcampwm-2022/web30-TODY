import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import useAxios from '@hooks/useAxios';
import { userState } from 'recoil/atoms';
import Loader from '@components/common/Loader';
import { UserData } from 'types/recoil.types';
import silentLoginRequest from './axios/requests/silentLoginRequest';
import Router from './routes/Router';

function App() {
  const [isAuthDone, setIsAuthDone] = useState(false);
  const [, , err, silentLoginData] = useAxios<UserData>(silentLoginRequest, {
    onMount: true,
  });
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!err) return;
    if (err.statusCode === 401) {
      setIsAuthDone(true);
    }
  }, [err]);

  useEffect(() => {
    if (!user) return;
    setIsAuthDone(true);
  }, [user]);

  useEffect(() => {
    if (silentLoginData === null) return;
    setUser(silentLoginData);
  }, [silentLoginData]);

  if (!isAuthDone) {
    return <Loader />;
  }

  return <Router />;
}

export default App;

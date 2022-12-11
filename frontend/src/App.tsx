import { useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import useAxios from '@hooks/useAxios';
import { userState } from 'recoil/atoms';
import Loader from '@components/common/Loader';
import silentLoginRequest from './axios/requests/silentLoginRequest';
import Router from './routes/Router';

function App() {
  const [isAuthDone, setIsAuthDone] = useState(false);
  const [requestSilentLogin, loading, err, silentLoginData] =
    useAxios(silentLoginRequest);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    if (!err) return;
    if (err.status === 401) {
      setIsAuthDone(true);
    }
  }, [err]);

  useEffect(() => {
    if (silentLoginData === null) return;
    setUser(silentLoginData);
    setIsAuthDone(true);
  }, [setUser, silentLoginData]);

  useEffect(() => {
    requestSilentLogin();
  }, [requestSilentLogin]);

  if (!isAuthDone) {
    return <Loader />;
  }

  return <Router />;
}

export default App;

import { RecoilRoot, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import useAxios from '@hooks/useAxios';
import { userState } from 'recoil/atoms';
import silentLoginRequest from './axios/requests/silentLoginRequest';
import Router from './routes/Router';

function App() {
  const [requestSilentLogin, loading, err, silentLoginData] =
    useAxios(silentLoginRequest);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    if (silentLoginData === null) return;
    setUser(silentLoginData);
  }, [setUser, silentLoginData]);

  useEffect(() => {
    requestSilentLogin();
  }, [requestSilentLogin]);

  return <Router />;
}

export default App;

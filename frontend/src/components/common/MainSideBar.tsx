import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import useAxios from '@hooks/useAxios';
import { useSetRecoilState } from 'recoil';
import { userState } from 'recoil/atoms';
import MenuList from './MenuList';
import UserProfile from './UserProfile';
import Logo from '../../assets/StyledLogo.png';
import logoutRequest from '../../axios/requests/logoutRequest';
import Loader from './Loader';

const SideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffce70;
  height: 100vh;
  width: 296px;
`;

const LogoutButton = styled.button`
  flex-basis: 100px;
  font-size: 1.5rem;
  background: none;
`;

const SideBar = styled.div<Props>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const LogoStyle = styled.img`
  position: absolute;
  top: 62px;
  left: 50%;
  transform: translate(-50%, 0);
`;

interface Props {
  width?: string;
  color?: string;
}

export default function MainSideBar(props: Props) {
  const navigate = useNavigate();
  const [requestLogout, logoutLoading, , logoutData] =
    useAxios<''>(logoutRequest);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    if (logoutData === null) return;
    setUser(null);
    navigate('/');
  }, [logoutData, navigate, setUser]);

  const logout = useCallback(() => {
    requestLogout();
  }, [requestLogout]);

  return (
    <SideBarWrapper>
      {logoutLoading && <Loader />}
      <SideBar {...props}>
        <Link to="/home">
          <LogoStyle src={Logo} alt="Logo" />
        </Link>
        <UserProfile />
        <MenuList />
      </SideBar>
      <LogoutButton onClick={logout}>로그아웃</LogoutButton>
    </SideBarWrapper>
  );
}

MainSideBar.defaultProps = {
  width: '296px',
  color: 'var(--yellow1)',
};

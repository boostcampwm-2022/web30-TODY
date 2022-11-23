import styled from 'styled-components';
import MenuList from './MenuList';
import UserProfile from './UserProfile';
import Logo from '../../assets/StyledLogo.png';

const SideBar = styled.div<Props>`
  position: relative;
  width: 296px;
  height: 100vh;
  background-color: #ffce70;
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
  return (
    <SideBar {...props}>
      <LogoStyle src={Logo} alt="Logo" />
      <UserProfile />
      <MenuList />
    </SideBar>
  );
}

MainSideBar.defaultProps = {
  width: '296px',
  color: 'var(--yellow1)',
};

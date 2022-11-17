import styled from 'styled-components';
import MenuList from './MenuList';
import UserProfile from './UserProfile';
import Logo from '../../assets/StyledLogo.png';

const SideBar = styled.div<Props>`
  position: relative;
  height: 100vh;
  width: 296px;
  background-color: #ffce70;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const LogoStyle = styled.img`
  position: absolute;
  width: 129px;
  height: 48px;
  top: 63px;
  left: 83px;
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

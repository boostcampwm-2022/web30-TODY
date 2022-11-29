import styled from 'styled-components';
import MainSideBar from '@components/common/MainSideBar';
import { ReactComponent as LogoWithName } from '@assets/logoWithName.svg';

const MainPageLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  position: relative;
  padding: 45px 30px;
`;

const StyledLogo = styled(LogoWithName)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function MainPage() {
  return (
    <MainPageLayout>
      <MainSideBar />
      <Content>
        <StyledLogo />
      </Content>
    </MainPageLayout>
  );
}

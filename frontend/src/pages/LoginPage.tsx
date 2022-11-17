import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import CustomInput from '../components/common/CustomInput';
import StyledHeader1 from '../components/common/StyledHeader1';

const LoginPageLayout = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function LoginPage() {
  return (
    <LoginPageLayout>
      <Wrapper>
        <StyledHeader1>로그인</StyledHeader1>
        <CustomInput placeholder="로그인" />
        <CustomInput placeholder="비밀번호" type="password" />
        <CustomButton>로그인</CustomButton>
      </Wrapper>
    </LoginPageLayout>
  );
}

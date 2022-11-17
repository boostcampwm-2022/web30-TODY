import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import CustomInput from '../components/common/CustomInput';
import StyledHeader1 from '../components/common/StyledHeader1';

const SignupPageLayout = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 358px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  gap: 6px;

  input {
    flex: 1;
  }
`;

export default function SignupPage() {
  return (
    <SignupPageLayout>
      <Wrapper>
        <StyledHeader1>회원가입</StyledHeader1>
        <InputWrapper>
          <CustomInput placeholder="아이디" />
          <CustomButton width="68px">확인</CustomButton>
        </InputWrapper>
        <InputWrapper>
          <CustomInput placeholder="닉네임" />
          <CustomButton width="68px">확인</CustomButton>
        </InputWrapper>
        <CustomInput placeholder="비밀번호" />
        <CustomInput placeholder="비밀번호 확인" />
        <CustomButton margin="20px 0 0 ">회원가입</CustomButton>
      </Wrapper>
    </SignupPageLayout>
  );
}

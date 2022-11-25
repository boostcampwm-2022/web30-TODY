import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import CustomInput from '@components/common/CustomInput';
import StyledHeader1 from '@components/common/StyledHeader1';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPageLayout = styled.div`
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

export default function LoginPage() {
  const navigate = useNavigate();
  const requestLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = Object.fromEntries(new FormData(form));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        formData,
      );
      // accessToken 저장
      // 홈 화면으로 이동
      alert('로그인 성공');
      navigate('/home');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <LoginPageLayout>
      <Wrapper>
        <StyledHeader1>로그인</StyledHeader1>
        <form onSubmit={requestLogin}>
          <CustomInput name="id" placeholder="아이디" />
          <CustomInput name="password" placeholder="비밀번호" type="password" />
          <CustomButton type="submit" margin="20px 0 0">
            로그인
          </CustomButton>
        </form>
      </Wrapper>
    </LoginPageLayout>
  );
}

/* eslint-disable no-alert */
import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import CustomInput from '@components/common/CustomInput';
import StyledHeader1 from '@components/common/StyledHeader1';
import { useNavigate, Link } from 'react-router-dom';
import useAxios from '@hooks/useAxios';
import { useCallback, useEffect } from 'react';
import Loader from '@components/common/Loader';
import useInputValidation from '@hooks/useInputValidation';
import loginRequest from '../axios/requests/loginRequest';

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

const SignUpText = styled.div`
  margin-top: 18px;
  font-size: 15px;
  text-align: center;

  .bold {
    font-weight: 700;
  }
`;

const StyledLink = styled(Link)`
  font-weight: 700;
  text-decoration: none;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [requestLogin, loginLoading, loginError, loginData] =
    useAxios(loginRequest);

  useEffect(() => {
    if (!loginError) return;
    alert(loginError.data);
  }, [loginError]);

  useEffect(() => {
    if (loginData === null) return;
    alert('로그인 성공');
    navigate('/home');
  }, [loginData, navigate]);

  const login = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      requestLogin(formData);
    },
    [requestLogin],
  );

  const [validateId, isIdValidated] = useInputValidation(
    (value) => !!value.length,
    '',
  );
  const [validatePw, isPwValidated] = useInputValidation(
    (value) => !!value.length,
    '',
  );

  return (
    <>
      {loginLoading && <Loader />}
      <LoginPageLayout>
        <Wrapper>
          <StyledHeader1>로그인</StyledHeader1>
          <form onSubmit={login}>
            <CustomInput name="id" placeholder="아이디" onChange={validateId} />
            <CustomInput
              onChange={validatePw}
              name="password"
              placeholder="비밀번호"
              type="password"
            />
            <CustomButton
              type="submit"
              disabled={!isIdValidated || !isPwValidated}
              margin="20px 0 0">
              로그인
            </CustomButton>
            <SignUpText>
              회원이 아니신가요?{' '}
              <StyledLink to="/signup">회원가입 GO</StyledLink>
            </SignUpText>
          </form>
        </Wrapper>
      </LoginPageLayout>
    </>
  );
}

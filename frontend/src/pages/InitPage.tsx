import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import { ReactComponent as TodyImage } from '@assets/tody.svg';
import { useNavigate, Link } from 'react-router-dom';

const InitPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #ffce70;
`;

const StyledTodyImage = styled(TodyImage)`
  width: 360px;
`;

const SignUpText = styled.div`
  margin-top: 18px;
  font-size: 18px;

  .bold {
    font-weight: 700;
  }
`;

const StyledLink = styled(Link)`
  font-weight: 700;
  text-decoration: none;
`;

export default function InitPage() {
  const navigate = useNavigate();

  const moveToLoginPage = () => {
    navigate('/login');
  };

  return (
    <InitPageLayout>
      <StyledTodyImage />
      <CustomButton width="200px" onClick={moveToLoginPage}>
        로그인
      </CustomButton>
      <SignUpText>
        회원이 아니신가요? <StyledLink to="/signup">회원가입 GO</StyledLink>
      </SignUpText>
    </InitPageLayout>
  );
}

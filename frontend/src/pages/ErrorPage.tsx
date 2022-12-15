import styled from 'styled-components';
import CustomButton from '@components/common/CustomButton';
import { useLocation, useNavigate } from 'react-router-dom';

const PageLayout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 30px;

  div + div {
    margin-top: 15px;
  }
`;

const MessageBox = styled.div`
  width: 600px;
  border-radius: 10px;
  padding: 30px;
  background-color: var(--orange2);
`;

export default function ErrorPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { message, statusCode, error } = state || {};

  const text =
    typeof message === 'object'
      ? Object.values(message || {}).join(', ')
      : message;

  return (
    <PageLayout>
      <div>에러가 발생했습니다 :(</div>
      <div>
        {statusCode} {error}
      </div>
      <MessageBox>message : {text}</MessageBox>

      <CustomButton
        onClick={() => {
          navigate('/home');
        }}
        width="130px"
        margin="100px 0 0">
        홈으로 이동
      </CustomButton>
    </PageLayout>
  );
}

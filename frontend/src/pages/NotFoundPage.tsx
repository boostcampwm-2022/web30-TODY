import styled from 'styled-components';
import NotFoundPageImage from '@assets/404.jpg';
import CustomButton from '@components/common/CustomButton';
import { useNavigate } from 'react-router-dom';

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

const StyledImage = styled.img`
  height: 300px;
`;

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <StyledImage
        src={NotFoundPageImage}
        alt="찾을 수 없는 페이지 에러 이미지"
      />
      <div>찾을 수 없는 페이지입니다.</div>
      <div>요청하신 페이지는 사라졌거나, 잘못된 경로를 이용하셨어요 :(</div>

      <CustomButton
        onClick={() => {
          navigate('home');
        }}
        width="130px"
        margin="100px 0 0">
        홈으로 이동
      </CustomButton>
    </PageLayout>
  );
}

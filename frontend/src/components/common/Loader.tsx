import { ReactComponent as LoadingIcon } from '@assets/loader.svg';
import styled from 'styled-components';

const Background = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffffc1; ;
`;

export default function Loader() {
  return (
    <Background>
      <LoadingIcon />
    </Background>
  );
}

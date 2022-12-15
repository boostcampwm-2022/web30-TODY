import styled from 'styled-components';

const NicknameWrapperLayout = styled.div`
  position: relative;
  width: 100%;
`;

const NameBox = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 10px;
  border-radius: 5px;
  background: rgba(37, 37, 37, 0.39);
  color: white;
`;

export default function NicknameWrapper({ children, nickname }: any) {
  return (
    <NicknameWrapperLayout>
      <NameBox>{nickname}</NameBox>
      {children}
    </NicknameWrapperLayout>
  );
}

import styled from 'styled-components';

const StyledHeader = styled.h1`
  margin-bottom: 45px;
  font-family: 'yg-jalnan';
  font-size: 30px;
`;

interface Props {
  children: string;
}
export default function StyledHeader1({ children }: Props) {
  return <StyledHeader>{children}</StyledHeader>;
}

import styled from 'styled-components';

const StyledHeader = styled.h1`
  font-family: 'yg-jalnan';
  font-size: 40px;
`;

interface Props {
  children: string;
}
export default function StyledHeader1({ children }: Props) {
  return <StyledHeader>{children}</StyledHeader>;
}

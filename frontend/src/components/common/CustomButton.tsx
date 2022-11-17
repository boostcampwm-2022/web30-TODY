import styled from 'styled-components';

// memo: 제네릭 Props 적용 전 -> width를 읽을 수 없다는 에러가 남.
const Button = styled.button<Props>`
  padding: 21px 0;
  margin: ${({ margin }) => `${margin}`};
  width: ${({ width }) => `${width}`};
  background-color: ${({ color }) => color};
  border-radius: 15px;
  color: white;
  font-size: 20px;
  font-weight: 700;
`;

interface Props {
  children: string;
  width?: string;
  color?: string;
  margin?: string;
}

export default function CustomButton(props: Props) {
  const { children, ...restProps } = props;

  return <Button {...restProps}>{children}</Button>;
}

CustomButton.defaultProps = {
  width: '100%',
  color: 'var(--orange)',
  margin: '0',
};

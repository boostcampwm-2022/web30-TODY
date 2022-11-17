import styled from 'styled-components';

// memo: 제네릭 Props 적용 전 -> width를 읽을 수 없다는 에러가 남.
const Button = styled.button<Props>`
  margin-top: 20px;
  padding: 21px 28px;
  width: ${({ width }) => `${width}px`};
  background-color: ${({ color }) => color};
  border-radius: 15px;
  color: white;
  font-weight: 700;
  border: none;
`;

interface Props {
  children: string;
  width?: number;
  color?: string;
}

export default function CustomButton(props: Props) {
  const { children, ...restProps } = props;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Button {...restProps}>{children}</Button>;
}

CustomButton.defaultProps = {
  width: 358,
  color: 'var(--orange)',
};

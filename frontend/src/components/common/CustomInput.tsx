import styled from 'styled-components';

const Input = styled.input<Props>`
  padding: 21px 28px;
  width: ${({ width }) => `${width}px`};
  border: 2px solid #ff8a00;
  border-radius: 15px;

  font-family: 'Pretendard';

  &::placeholder {
    color: #ffc7a1;
  }
  & + & {
    margin-top: 10px;
  }
`;

interface Props {
  width?: number;
  placeholder?: string;
  type?: string;
}

export default function CustomInput(props: Props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Input {...props} />;
}

CustomInput.defaultProps = {
  width: 358,
  placeholder: '',
  type: 'text',
};

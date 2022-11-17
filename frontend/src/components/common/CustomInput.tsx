import styled from 'styled-components';

const Input = styled.input<Props>`
  padding: 21px 28px;
  width: ${({ width }) => width};
  border: 2px solid #ff8a00;
  border-radius: 15px;

  font-family: 'Pretendard';
  font-size: 20px;

  &::placeholder {
    color: #ffc7a1;
  }
  & + & {
    margin-top: 10px;
  }
`;

interface Props {
  width?: string;
  placeholder?: string;
  type?: string;
}

export default function CustomInput(props: Props) {
  return <Input {...props} />;
}

CustomInput.defaultProps = {
  width: '100%',
  placeholder: '',
  type: 'text',
};

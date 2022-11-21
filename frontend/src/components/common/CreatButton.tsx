import styled from 'styled-components';
import CreateIcon from '@assets/icons/create.svg';

const Button = styled.button`
  float: right;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 20px 12px;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
  background-color: #ffeec3;

  font-family: 'yg-jalnan';
  font-weight: 700;
  font-size: 18px;
`;

interface Props {
  children: string;
}

export default function CreateButton({ children }: Props) {
  return (
    <Button>
      <img src={CreateIcon} alt="" />
      {children}
    </Button>
  );
}

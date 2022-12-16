import styled from 'styled-components';
import CheckIcon from '@assets/icons/check.svg';
import { useNavigate } from 'react-router-dom';

const ViewConditionCheckBoxLayout = styled.div`
  display: flex;
  gap: 10px;
`;
const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  font-size: 18px;
`;
const StyledInput = styled.input`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  appearance: none;
  border: 3px solid #ffe0a5;
  border-radius: 8px;

  &:checked {
    background-image: url(${CheckIcon});
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`;

interface Props {
  children: string;
  getRoomConditions: { page: string; keyword: string };
}

export default function ViewConditionCheckBox({
  children,
  getRoomConditions,
}: Props) {
  const { page, keyword } = getRoomConditions;
  const navigate = useNavigate();
  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(
      `/study-rooms?page=${page || 1}&keyword=${keyword || ''}&attendable=${
        e.target.checked
      }`,
    );
  };
  return (
    <ViewConditionCheckBoxLayout>
      <StyledLabel htmlFor={children}>
        <StyledInput type="checkbox" id={children} onChange={handleCheckBox} />
        {children}
      </StyledLabel>
    </ViewConditionCheckBoxLayout>
  );
}

import styled from 'styled-components';
import CheckIcon from '@assets/icons/check.svg';

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
}

export default function ViewConditionCheckBox({ children }: Props) {
  return (
    <ViewConditionCheckBoxLayout>
      <StyledLabel htmlFor={children}>
        <StyledInput type="checkbox" id={children} />
        {children}
      </StyledLabel>
    </ViewConditionCheckBoxLayout>
  );
}

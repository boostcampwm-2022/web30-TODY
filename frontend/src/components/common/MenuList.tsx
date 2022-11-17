import styled from 'styled-components';
import menuHome from '../../assets/home.png';
import menuStudy from '../../assets/study.png';
import menuQuestion from '../../assets/question.png';

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 29px;
`;

const MenuItem = styled.div`
  width: 132px;
  height: 42px;
  display: flex;
  gap: 10px;
  padding: 6px 13px;
  text-align: left;
  font-family: 'Pretendard-Regular';
  font-size: 25px;
`;

export default function MenuList() {
  return (
    <List>
      <MenuItem>
        <img src={menuHome} alt="home" />홈
      </MenuItem>
      <MenuItem>
        <img src={menuStudy} alt="study" />
        공부방
      </MenuItem>
      <MenuItem>
        <img src={menuQuestion} alt="question" />
        질문방
      </MenuItem>
    </List>
  );
}

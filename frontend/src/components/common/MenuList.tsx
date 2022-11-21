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
  align-items: center;
  gap: 10px;
  padding: 6px 13px;
  border-radius: 8px;
  text-align: left;
  font-family: 'Pretendard-Regular';
  font-size: 25px;

  &:hover {
    background-color: #ffb11a;
    box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.25);
  }
`;

export default function MenuList() {
  const menuList = [
    {
      name: '홈',
      iconSrc: menuHome,
    },
    {
      name: '공부방',
      iconSrc: menuStudy,
    },
    {
      name: '질문방',
      iconSrc: menuQuestion,
    },
  ];

  return (
    <List>
      {menuList.map((menu) => (
        <MenuItem key={menu.name}>
          <img src={menu.iconSrc} alt={`${menu.name} 페이지`} />
          {menu.name}
        </MenuItem>
      ))}
    </List>
  );
}

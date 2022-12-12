import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
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

  &:hover,
  &.active {
    background-color: #ffb11a;
    box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.25);
  }
`;

export default function MenuList() {
  const location = useLocation();
  const menuList = [
    {
      name: '홈',
      iconSrc: menuHome,
      path: '/home',
    },
    {
      name: '공부방',
      iconSrc: menuStudy,
      path: '/study-rooms',
    },
  ];

  return (
    <List>
      {menuList.map((menu) => (
        <Link to={menu.path} style={{ textDecoration: 'none' }} key={menu.name}>
          <MenuItem className={location.pathname === menu.path ? 'active' : ''}>
            <img src={menu.iconSrc} alt={`${menu.name} 페이지`} />
            {menu.name}
          </MenuItem>
        </Link>
      ))}
    </List>
  );
}

import styled from 'styled-components';
import { ReactComponent as SearchIcon } from '@assets/icons/searchBarButton.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBarLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const GuideText = styled.span`
  margin-bottom: 10px;
  padding-left: 12px;
  font-family: 'Pretendard-Regular';
  font-size: 16px;
  color: #a3a3a3;
`;
const SearchBarInputWrapper = styled.div`
  width: 100%;
  position: relative;
`;
const SearchBarInput = styled.input`
  width: 100%;
  padding: 23px 75px 23px 44px;
  background: white;
  border: 3px solid var(--orange);
  border-radius: 35px;
  font-weight: 700;
  font-size: 20px;

  &::placeholder {
    color: #ffc7a1;
    font-weight: 400;
  }
`;
const SearchBarButton = styled.button`
  display: flex;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  margin-right: 7px;
  background: none;
  padding: 0;
`;

interface Props {
  guideText?: string;
  setKeyword: any;
  setPage: any;
  attendable: any;
}

export default function SearchBar({
  guideText,
  setKeyword,
  setPage,
  attendable,
}: Props) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const onChange = (e: any) => {
    setInput(e.target.value);
  };

  const searchRoomList = () => {
    navigate(`/study-rooms?page=1&keyword=${input}&attendable=${attendable}`);
    setKeyword(input);
    setPage(1);
    setInput('');
  };

  return (
    <SearchBarLayout>
      <GuideText>{guideText}</GuideText>
      <SearchBarInputWrapper>
        <SearchBarInput
          placeholder="검색어를 입력하세요"
          value={input}
          onChange={onChange}
          onKeyUp={(e) => (e.key === 'Enter' ? searchRoomList() : null)}
        />
        <SearchBarButton onClick={searchRoomList}>
          <SearchIcon />
        </SearchBarButton>
      </SearchBarInputWrapper>
    </SearchBarLayout>
  );
}

SearchBar.defaultProps = {
  guideText: '',
};

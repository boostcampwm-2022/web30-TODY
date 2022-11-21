import styled from 'styled-components';
import { ReactComponent as SearchIcon } from '@assets/icons/searchBarButton.svg';

const SearchBarLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
}

export default function SearchBar(props: Props) {
  const { guideText } = props;
  return (
    <SearchBarLayout>
      <GuideText>{guideText}</GuideText>
      <SearchBarInputWrapper>
        <SearchBarInput placeholder="검색어를 입력하세요" />
        <SearchBarButton>
          <SearchIcon />
        </SearchBarButton>
      </SearchBarInputWrapper>
    </SearchBarLayout>
  );
}

SearchBar.defaultProps = {
  guideText: '',
};

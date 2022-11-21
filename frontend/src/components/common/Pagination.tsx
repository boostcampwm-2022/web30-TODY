import styled from 'styled-components';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/leftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/rightArrow.svg';

const PaginationLayout = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 22px;
`;

const Page = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
  background-color: ${({ selected }) => (selected ? '#ffeec3' : 'none')};
  border-radius: 6px;
  font-size: 20px;
`;

interface Props {
  pageCount: number;
  currentPage: number;
}
export default function Pagination({ pageCount, currentPage }: Props) {
  return (
    <PaginationLayout>
      <LeftArrowIcon />
      {Array(pageCount)
        .fill(0)
        .map((_, index) => (
          <Page selected={currentPage === index + 1}>{index + 1}</Page>
        ))}
      <RightArrowIcon />
    </PaginationLayout>
  );
}

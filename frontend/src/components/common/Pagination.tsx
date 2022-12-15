import styled from 'styled-components';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/leftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/rightArrow.svg';
import { useNavigate } from 'react-router-dom';
import React, { SetStateAction } from 'react';

const PaginationLayout = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 22px;
`;

const Page = styled.button<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
  background-color: ${({ selected }) =>
    selected ? '#ffeec3' : 'var(--white)'};
  border-radius: 6px;
  font-size: 20px;
`;

interface Props {
  pageCount: number;
  currentPage: number;
  getRoomConditions: { keyword: string; attendable: boolean };
  setPage: React.Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  pageCount,
  currentPage,
  getRoomConditions,
  setPage,
}: Props) {
  const navigate = useNavigate();
  const { keyword, attendable } = getRoomConditions;

  const onClickPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextPage = Number((e.target as HTMLElement).innerText);
    if (currentPage === nextPage) return;
    navigate(
      `/study-rooms?page=${nextPage}&keyword=${keyword}&attendable=${attendable}`,
    );
    setPage(nextPage);
  };

  return (
    <PaginationLayout>
      <LeftArrowIcon />
      {Array(pageCount)
        .fill(0)
        .map((x, index) => index + 1)
        .map((page) => (
          <Page
            onClick={onClickPage}
            key={page}
            selected={currentPage === page}>
            {page}
          </Page>
        ))}
      <RightArrowIcon />
    </PaginationLayout>
  );
}

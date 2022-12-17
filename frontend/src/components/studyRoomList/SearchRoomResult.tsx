import Loader from '@components/common/Loader';
import Pagination from '@components/common/Pagination';
import ViewConditionCheckBox from '@components/common/ViewConditionCheckBox';
import useAxios from '@hooks/useAxios';
import qs from 'qs';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RoomListData } from 'types/studyRoomList.types';
import getStudyRoomListRequest from '../../axios/requests/getStudyRoomListRequest';
import StudyRoomList from './StudyRoomList';

const SearchInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchResultText = styled.h3`
  font-weight: 700;
  font-size: 20px;
`;

function SearchRoomResult() {
  const location = useLocation();
  const queryString = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const [
    getRoomListRequest,
    getRoomListLoading,
    getRoomListError,
    searchResult,
  ] = useAxios<RoomListData>(getStudyRoomListRequest);

  useEffect(() => {
    const page = queryString.page === undefined ? 1 : queryString.page;
    const keyword =
      queryString.keyword === undefined ? '' : queryString.keyword;
    const attendable =
      queryString.attendable === undefined ? false : queryString.attendable;

    getRoomListRequest({
      page,
      keyword,
      attendable,
    });
  }, [queryString.keyword, queryString.page, queryString.attendable]);

  return (
    <>
      {getRoomListLoading && <Loader />}
      <SearchInfoLayout>
        <SearchResultText>
          {searchResult?.keyword &&
            `"${searchResult?.keyword}"에 대한 검색결과`}{' '}
          총 {searchResult?.totalCount}건
        </SearchResultText>
        <div className="flex-row">
          <ViewConditionCheckBox
            getRoomConditions={{
              page: queryString.page as string,
              keyword: queryString.keyword as string,
            }}>
            참여 가능한 방만 보기
          </ViewConditionCheckBox>
        </div>
      </SearchInfoLayout>
      <StudyRoomList searchResult={searchResult} />
      {searchResult && (
        <Pagination
          pageCount={searchResult.pageCount}
          currentPage={searchResult.currentPage}
          getRoomConditions={{
            keyword: queryString.keyword as string,
            attendable: queryString.attendable as string,
          }}
        />
      )}
    </>
  );
}

export default React.memo(SearchRoomResult);

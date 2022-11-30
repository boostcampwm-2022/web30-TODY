import styled from 'styled-components';
import StudyRoomItem from '@components/studyRoomList/StudyRoomItem';
import { RoomListData } from './studyRoomList.types';

const RoomListLayout = styled.div`
  min-height: 485px;
  margin: 30px 0 35px;
`;

const RoomList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
`;

interface Props {
  searchResult: RoomListData | null;
}

export default function StudyRoomList({ searchResult }: Props) {
  return (
    <RoomListLayout>
      <RoomList>
        {searchResult &&
          searchResult.studyRoomList.map((room) => (
            <StudyRoomItem key={room.studyRoomId} {...room} />
          ))}
      </RoomList>
    </RoomListLayout>
  );
}

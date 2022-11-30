export interface RoomListData {
  keyword: string;
  currentPage: number;
  pageCount: number;
  totalCount: number;
  studyRoomList: RoomItemData[];
}

export interface RoomItemData {
  studyRoomId: number;
  name: string;
  content: string;
  currentPersonnel: number;
  maxPersonnel: number;
  managerNickname: string;
  tags: string[];
  nickNameOfParticipants: string[];
  created: string;
}

export interface NewRoomInfoData {
  name: string;
  content: string;
  maxPersonnel: number;
}

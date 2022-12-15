export type RoomInfoData = {
  studyRoomId: number;
  name: string;
  content: string;
  currentPersonnel: number;
  maxPersonnel: number;
  managerNickname: string;
  tags: string[];
  nickNameOfParticipants: string[];
  created: string;
} | null;

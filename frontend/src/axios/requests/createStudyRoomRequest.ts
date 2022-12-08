import axiosBackend from '../instances/axiosBackend';

interface NewRoomInfoProps {
  managerId: string;
  name: string;
  content: string;
  maxPersonnel: number;
  tags: string[];
}

export default function createStudyRoomRequest(newRoomInfo: NewRoomInfoProps) {
  return axiosBackend.post(`/study-room`, newRoomInfo);
}

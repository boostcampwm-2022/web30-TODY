import axiosBackend from '../instances/axiosBackend';

export default function getParticipantsListRequest(studyRoomId: number) {
  return axiosBackend.get(
    `/study-room/participants?study-room-id=studyRoom${studyRoomId}`,
  );
}

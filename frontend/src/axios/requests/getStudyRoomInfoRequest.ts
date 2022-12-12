import axiosBackend from '../instances/axiosBackend';

export default (roomId: string) => {
  return axiosBackend.get(`/study-room/roomInfo/${roomId}`);
};

import axiosBackend from '../instances/axiosBackend';

interface Body {
  studyRoomId: number;
  userId: string;
}

export default (body: Body) => {
  return axiosBackend.post('/study-room/check-is-full', body);
};

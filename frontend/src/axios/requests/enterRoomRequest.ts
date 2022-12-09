import axiosBackend from '../instances/axiosBackend';

interface FormData {
  studyRoomId: number;
  userId: string;
  nickname: string;
  isMaster: boolean;
}

export default (formData: FormData) => {
  return axiosBackend.post('/user/enterRoom', formData, {
    withCredentials: true,
  });
};

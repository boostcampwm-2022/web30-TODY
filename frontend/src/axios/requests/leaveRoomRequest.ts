import axiosBackend from '../instances/axiosBackend';

interface FormData {
  studyRoomId: number;
  userId: string;
}

export default (formData: FormData) => {
  return axiosBackend.post('/user/leaveRoom', formData, {
    withCredentials: true,
  });
};

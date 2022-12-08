import axiosBackend from '../instances/axiosBackend';

interface FormData {
  studyRoomId: number;
  userId: string;
}

export default (formData: FormData) => {
  return axiosBackend.post('/study-room/check-master', formData, {
    withCredentials: true,
  });
};

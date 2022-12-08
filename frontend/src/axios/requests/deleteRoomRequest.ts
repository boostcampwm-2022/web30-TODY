import axiosBackend from '../instances/axiosBackend';

interface FormData {
  studyRoomId: number;
}

export default (formData: FormData) => {
  return axiosBackend.post('/study-room/deleteRoom', formData, {
    withCredentials: true,
  });
};

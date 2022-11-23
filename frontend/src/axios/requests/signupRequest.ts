import axiosBackend from '../instances/axiosBackend';

interface FormData {
  id: string;
  nickname: string;
  password: string;
}

export default (formData: FormData) => {
  return axiosBackend.post(`/user/signup`, formData);
};

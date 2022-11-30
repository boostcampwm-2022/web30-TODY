import axiosBackend from '../instances/axiosBackend';

interface FormData {
  id: string;
  password: string;
}

export default (formData: FormData) => {
  return axiosBackend.post('/user/login', formData, {
    withCredentials: true,
  });
};

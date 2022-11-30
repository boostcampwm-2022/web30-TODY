import axiosBackend from '../instances/axiosBackend';

export default (id: string) => {
  return axiosBackend.get(`/user/checkID/${id}`);
};

import axiosBackend from '../instances/axiosBackend';

export default (userId: string) => {
  return axiosBackend.get(`/user/isInRoom?user-id=${userId}`);
};

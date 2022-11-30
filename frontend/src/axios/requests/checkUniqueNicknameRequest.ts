import axiosBackend from '../instances/axiosBackend';

export default (nickname: string) => {
  return axiosBackend.get(`/user/checkNickname/${nickname}`);
};

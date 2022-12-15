import axiosBackend from '../instances/axiosBackend';

interface Query {
  roomId: number;
  userId: string;
}

export default ({ roomId, userId }: Query) => {
  return axiosBackend.get(
    `/study-room/enterable?roomId=${roomId}&userId=${userId}`,
  );
};

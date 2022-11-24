import axiosBackend from '../instances/axiosBackend';

interface ConditionProps {
  page: number;
  keyword: string;
  attendable: boolean;
}

export default function getStudyRoomListRequest({
  page,
  keyword,
  attendable,
}: ConditionProps) {
  return axiosBackend.get(
    `/study-room?page=${page}&keyword=${keyword}&attendable=${attendable}`,
  );
}

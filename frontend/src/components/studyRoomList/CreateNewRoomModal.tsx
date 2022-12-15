import CustomButton from '@components/common/CustomButton';
import CustomInput from '@components/common/CustomInput';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import useAxios from '@hooks/useAxios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import styled from 'styled-components';
import { NewRoomInfoData } from 'types/studyRoomList.types';
import createStudyRoomRequest from '../../axios/requests/createStudyRoomRequest';
import TagInput from './TagInput';

const PageTitle = styled.h1`
  margin-bottom: 24px;
  font-family: 'yg-jalnan';
  font-size: 25px;
  font-weight: 700;
`;

interface Props {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateNewRoomModal({ setModal }: Props) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const newRoomInfoInitState = {
    name: '',
    content: '',
    maxPersonnel: 1,
  };

  const [newRoomInfo, setNewRoomInfo] =
    useState<NewRoomInfoData>(newRoomInfoInitState);

  const [tagList, setTagList] = useState<string[]>([]);

  const [createRoomRequest, createRoomLoading, , createdRoomId] = useAxios<{
    studyRoomId: number;
  }>(createStudyRoomRequest);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.slice(0, 25);
      case 'content':
        return value.slice(0, 100);
      case 'maxPersonnel':
        return Number(value);
      default:
        return value;
    }
  };
  const onChangeNewRoomInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoomInfo({
      ...newRoomInfo,
      [name]: validateInput(name, value),
    });
  };

  useEffect(() => {
    if (createdRoomId) {
      navigate(`/study-room/${createdRoomId}`, {
        state: newRoomInfo,
      });
    }
  }, [createdRoomId]);

  const createNewStudyRoom = () => {
    if (newRoomInfo.name === '' || newRoomInfo.maxPersonnel < 1) return;

    if (user) {
      createRoomRequest({
        ...newRoomInfo,
        managerId: user.userId,
        tags: tagList,
      });
    }
    setTagList([]);
  };
  return (
    <>
      {createRoomLoading && <Loader />}
      <Modal setModal={setModal}>
        <PageTitle>새로운 공부방 만들기</PageTitle>
        <CustomInput
          placeholder="방 이름"
          guideText="※ 방 이름은 25자 이내로 작성해주세요."
          name="name"
          value={newRoomInfo.name}
          onChange={onChangeNewRoomInfo}
        />
        <CustomInput
          placeholder="방 설명"
          guideText="※ 방 설명은 100자 이내로 작성해주세요."
          name="content"
          value={newRoomInfo.content}
          onChange={onChangeNewRoomInfo}
        />
        <CustomInput
          placeholder="방 접속 최대 인원 수"
          guideText="※ 인원수는 최소 1명 이상이어야 합니다."
          type="number"
          name="maxPersonnel"
          min={1}
          value={newRoomInfo.maxPersonnel}
          onChange={onChangeNewRoomInfo}
        />
        <TagInput tagList={tagList} setTagList={setTagList} />
        <CustomButton onClick={createNewStudyRoom} margin="20px 0 0">
          공부하러 GO
        </CustomButton>
      </Modal>
    </>
  );
}

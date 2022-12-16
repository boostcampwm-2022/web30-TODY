/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import CustomButton from '@components/common/CustomButton';
import CustomInput from '@components/common/CustomInput';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import useAxios from '@hooks/useAxios';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import styled from 'styled-components';
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
  const [tagList, setTagList] = useState<string[]>([]);
  const [maxPersonnel, setMaxPersonnel] = useState<number>(1);

  const [createRoomRequest, createRoomLoading, , createdRoomId] = useAxios<{
    studyRoomId: number;
  }>(createStudyRoomRequest);

  useEffect(() => {
    if (createdRoomId) {
      navigate(`/study-room/${createdRoomId}`);
    }
  }, [createdRoomId]);

  const createNewStudyRoom = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      if (formData.name === '') return;
      if (user) {
        createRoomRequest({
          ...formData,
          maxPersonnel,
          managerId: user.userId,
          tags: tagList,
        });
      }
      setTagList([]);
    },
    [maxPersonnel],
  );

  const toNumber = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMaxPersonnel(Number(e.currentTarget.value));
  }, []);

  const preventDefault = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
  }, []);

  return (
    <>
      {createRoomLoading && <Loader />}
      <Modal setModal={setModal}>
        <PageTitle>새로운 공부방 만들기</PageTitle>
        <form onSubmit={createNewStudyRoom} onKeyDown={preventDefault}>
          <CustomInput
            placeholder="방 이름"
            guideText="※ 방 이름은 25자 이내로 작성해주세요."
            name="name"
            maxLength={25}
          />
          <CustomInput
            placeholder="방 설명"
            guideText="※ 방 설명은 100자 이내로 작성해주세요."
            name="content"
            maxLength={100}
          />
          <CustomInput
            placeholder="방 접속 최대 인원 수"
            guideText="※ 인원수는 최소 1명 이상이어야 합니다."
            type="number"
            name="maxPersonnel"
            onChange={toNumber}
            value={maxPersonnel}
            min={1}
          />
          <TagInput tagList={tagList} setTagList={setTagList} />
          <CustomButton type="submit" margin="20px 0 0">
            공부하러 GO
          </CustomButton>
        </form>
      </Modal>
    </>
  );
}

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
    },
    [maxPersonnel, tagList],
  );

  const toNumber = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMaxPersonnel(Number(e.currentTarget.value));
  }, []);

  const preventDefault = useCallback((e: React.KeyboardEvent) => {
    const el = e.target as Element;
    if (e.key === 'Enter' && el.tagName !== 'BUTTON') e.preventDefault();
  }, []);

  return (
    <>
      {createRoomLoading && <Loader />}
      <Modal setModal={setModal}>
        <PageTitle>????????? ????????? ?????????</PageTitle>
        <form onSubmit={createNewStudyRoom} onKeyDown={preventDefault}>
          <CustomInput
            placeholder="??? ??????"
            guideText="??? ??? ????????? 25??? ????????? ??????????????????."
            name="name"
            maxLength={25}
            required
          />
          <CustomInput
            placeholder="??? ??????"
            guideText="??? ??? ????????? 100??? ????????? ??????????????????."
            name="content"
            maxLength={100}
          />
          <CustomInput
            placeholder="??? ?????? ?????? ?????? ???"
            guideText="??? ???????????? ?????? 1??? ??????????????? ?????????."
            type="number"
            name="maxPersonnel"
            onChange={toNumber}
            value={maxPersonnel}
            min={1}
          />
          <TagInput tagList={tagList} setTagList={setTagList} />
          <CustomButton type="submit" margin="20px 0 0">
            ???????????? GO
          </CustomButton>
        </form>
      </Modal>
    </>
  );
}

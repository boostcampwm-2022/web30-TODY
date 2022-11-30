/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useAxios from '@hooks/useAxios';
import CustomButton from '@components/common/CustomButton';
import styled from 'styled-components';
import Loader from '@components/common/Loader';
import { useNavigate } from 'react-router-dom';
import useInputValidation from '@hooks/useInputValidation';
import checkUniqueIdRequest from '../axios/requests/checkUniqueIdRequest';
import checkUniqueNicknameRequest from '../axios/requests/checkUniqueNicknameRequest';
import signupRequest from '../axios/requests/signupRequest';
import CustomInput from '../components/common/CustomInput';
import StyledHeader1 from '../components/common/StyledHeader1';

const SignupPageLayout = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 358px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  gap: 6px;

  input {
    flex: 1;
  }
`;

const validations = {
  id: {
    minLength: 4,
    maxLength: 15,
  },
  nickname: {
    minLength: 4,
    maxLength: 15,
  },
  password: {
    reg: /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,20}$/,
  },
};

const notifications = {
  welcomeNewUser: (nickname: string) => `${nickname}님 환영합니다.`,
  idIsUnique: (id: string) => `${id} : 사용할 수 있는 아이디입니다.`,
  idIsNotUnique:
    '다른 사용자가 사용중인 아이디입니다. 다른 아이디를 사용해주세요.',
  nicknameIsUnique: (nickname: string) =>
    `${nickname} : 사용할 수 있는 닉네임입니다.`,
  nicknameIsNotUnique:
    '다른 사용자가 사용중인 닉네임입니다. 다른 닉네임을 사용해주세요.',
  passwordDidntMatch: '비밀번호가 일치하지 않습니다.',
  needsCheckUnique: '중복 확인이 필요합니다.',
  idIsNotValidated: `${validations.id.minLength}~${validations.id.maxLength}자로 설정해주세요.`,
  nicknameIsNotValidated: `${validations.nickname.minLength}~${validations.nickname.maxLength}자로 설정해주세요.`,
  passwordIsNotValidated: `숫자, 문자 특수기호를 포함하여 8~20자로 설정해주세요.`,
};

export default function SignupPage() {
  const navigate = useNavigate();
  const idInputRef = useRef<HTMLInputElement>(null);
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [requestSignup, signupLoading, signupError, signupData] = useAxios<{
    nickname: string;
  }>(signupRequest);
  const [
    requestCheckUniqueId,
    checkUniqueIdLoading,
    checkUniqueIdError,
    checkUniqueIdData,
  ] = useAxios<{ isUnique: boolean; id: string }>(checkUniqueIdRequest);
  const [
    requestCheckUniqueNickname,
    checkUniqueNicknameLoading,
    checkUniqueNicknameError,
    checkUniqueNicknameData,
  ] = useAxios<{ isUnique: boolean; nickname: string }>(
    checkUniqueNicknameRequest,
  );

  useEffect(() => {
    if (signupData === null) return;
    alert(notifications.welcomeNewUser(signupData.nickname));
    navigate('/login');
  }, [signupData, navigate]);

  useEffect(() => {
    if (checkUniqueIdData === null) return;
    alert(
      checkUniqueIdData.isUnique
        ? notifications.idIsUnique(checkUniqueIdData.id)
        : notifications.idIsNotUnique,
    );
  }, [checkUniqueIdData]);

  useEffect(() => {
    if (checkUniqueNicknameData === null) return;
    alert(
      checkUniqueNicknameData.isUnique
        ? notifications.nicknameIsUnique(checkUniqueNicknameData.nickname)
        : notifications.nicknameIsNotUnique,
    );
  }, [checkUniqueNicknameData]);

  useEffect(() => {
    if (signupError) alert(signupError);
  }, [signupError]);

  useEffect(() => {
    if (checkUniqueIdError) alert(checkUniqueIdError);
  }, [checkUniqueIdError]);

  useEffect(() => {
    if (checkUniqueNicknameError) alert(checkUniqueNicknameError);
  }, [checkUniqueNicknameError]);

  const validateSignupForm = useCallback(
    (formData: { [k: string]: FormDataEntryValue }) => {
      setIsPasswordSame(formData.password === formData.passwordSame);
      if (formData.password !== formData.passwordSame) {
        alert(notifications.passwordDidntMatch);
        return false;
      }
      return true;
    },
    [],
  );

  const signup = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      if (!validateSignupForm(formData)) return;
      delete formData.passwordSame;
      requestSignup(formData);
    },
    [requestSignup, validateSignupForm],
  );

  const checkUniqueId = useCallback(() => {
    const { value: id } = idInputRef.current!;
    requestCheckUniqueId(id);
  }, [requestCheckUniqueId]);

  const checkUniqueNickname = useCallback(() => {
    const { value: nickname } = nicknameInputRef.current!;
    requestCheckUniqueNickname(nickname);
  }, [requestCheckUniqueNickname]);

  const [validateId, isIdValidated] = useInputValidation((value) => {
    return (
      value.length >= validations.id.minLength && validations.id.maxLength <= 15
    );
  }, '');
  const [validateNickname, isNicknameValidated] = useInputValidation(
    (value) => {
      return (
        value.length >= validations.nickname.minLength &&
        value.length <= validations.nickname.maxLength
      );
    },
    '',
  );
  const [validatePw, isPwValidated] = useInputValidation((value) => {
    return validations.password.reg.test(value);
  }, '');

  return (
    <>
      {signupLoading && <Loader />}
      <SignupPageLayout>
        <Wrapper>
          <StyledHeader1>회원가입</StyledHeader1>
          <form onSubmit={signup}>
            <InputWrapper>
              <CustomInput
                onChange={validateId}
                warningText={
                  isIdValidated ? '' : notifications.idIsNotValidated
                }
                guideText={
                  checkUniqueIdData?.isUnique
                    ? notifications.idIsUnique(checkUniqueIdData.id)
                    : notifications.needsCheckUnique
                }
                inputRef={idInputRef}
                name="id"
                placeholder="아이디"
              />
              <CustomButton
                type="button"
                disabled={checkUniqueIdLoading || !isIdValidated}
                onClick={checkUniqueId}
                width="68px"
                height="67px">
                확인
              </CustomButton>
            </InputWrapper>
            <InputWrapper>
              <CustomInput
                onChange={validateNickname}
                warningText={
                  isNicknameValidated
                    ? ''
                    : notifications.nicknameIsNotValidated
                }
                guideText={
                  checkUniqueNicknameData?.isUnique
                    ? notifications.nicknameIsUnique(
                        checkUniqueNicknameData.nickname,
                      )
                    : notifications.needsCheckUnique
                }
                inputRef={nicknameInputRef}
                name="nickname"
                placeholder="닉네임"
              />
              <CustomButton
                type="button"
                disabled={checkUniqueNicknameLoading || !isNicknameValidated}
                onClick={checkUniqueNickname}
                width="68px"
                height="67px">
                확인
              </CustomButton>
            </InputWrapper>
            <CustomInput
              onChange={validatePw}
              warningText={
                isPwValidated ? '' : notifications.passwordIsNotValidated
              }
              name="password"
              placeholder="비밀번호"
              type="password"
            />
            <CustomInput
              name="passwordSame"
              placeholder="비밀번호 확인"
              warningText={
                !isPasswordSame ? notifications.passwordDidntMatch : ''
              }
              type="password"
            />
            <CustomButton
              type="submit"
              disabled={
                signupLoading ||
                checkUniqueIdLoading ||
                checkUniqueNicknameLoading ||
                !isIdValidated ||
                !isNicknameValidated ||
                !isPwValidated ||
                !checkUniqueNicknameData?.isUnique ||
                !checkUniqueNicknameData?.isUnique
              }
              margin="20px 0 0 ">
              회원가입
            </CustomButton>
          </form>
        </Wrapper>
      </SignupPageLayout>
    </>
  );
}

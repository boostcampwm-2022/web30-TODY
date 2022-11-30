import { atom } from 'recoil';

export const userState = atom<{ userId: string; nickname: string } | null>({
  key: 'userState',
  default: null,
});

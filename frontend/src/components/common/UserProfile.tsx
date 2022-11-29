import { useRecoilValue } from 'recoil';
import { userState } from 'recoil/atoms';
import styled from 'styled-components';
import sampleImage from '../../assets/sample.jpg';
import Loader from './Loader';

const Profile = styled.div``;

const UserProfileImage = styled.img`
  margin-top: 148px;
  margin-bottom: 15px;
  width: 149px;
  height: 149px;
  border-radius: 100%;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.25));
`;

const UserProfileName = styled.div`
  margin-bottom: 142px;
  font-family: 'yg-jalnan';
  font-weight: 700;
  font-size: 22px;
`;

interface Props {
  src?: string;
}

export default function UserProfile({ src }: Props) {
  const user = useRecoilValue(userState);
  return (
    <Profile>
      <UserProfileImage src={src} alt="sample" />
      <UserProfileName>{user ? user.nickname : 'loading...'}</UserProfileName>
    </Profile>
  );
}

UserProfile.defaultProps = {
  src: sampleImage,
};
